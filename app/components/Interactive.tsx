import type { ComponentType, LazyExoticComponent } from "react";
import { Suspense, useEffect, useRef, useState } from "react";
import { CornersOutIcon, HandPointingIcon } from "@phosphor-icons/react";
import { useFullscreen } from "@reactuses/core";
import clsx from "clsx";
import Button from "~/components/Button";

type Props<ComponentProps extends Record<string, unknown>> = {
  // lazy-loaded component
  Component: LazyExoticComponent<ComponentType<ComponentProps>>;
} &
  // rest of props get passed to lazy component
  ComponentProps;

// interactive component for lessons
export default function Interactive<
  ComponentProps extends Record<string, unknown>,
>({ Component, ...props }: Props<ComponentProps>) {
  const ref = useRef<HTMLDivElement>(null);

  // are we on client or ssr'ing
  const [isClient, setIsClient] = useState(false);

  // fullscreen control
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(ref);

  useEffect(() => {
    // eslint-disable-next-line
    setIsClient(true);
  }, []);

  // don't render on server
  if (!isClient) return null;

  return (
    <Suspense fallback="Browser-only interactive">
      <div className="relative isolate flex flex-col gap-4">
        <div className="absolute -inset-x-999 -inset-y-4 -z-10 max-w-[unset]! bg-secondary/10" />
        <div
          ref={ref}
          className={clsx(
            "relative isolate flex flex-col items-center justify-center-safe gap-8 [&_.p5Canvas]:h-[unset]! [&_.p5Canvas]:max-w-full [&_.react-p5]:max-w-full",
            isFullscreen && "bg-white",
          )}
        >
          <Component {...(props as unknown as ComponentProps)} />
        </div>
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-gray">
            Interactive
            <HandPointingIcon className="icon -rotate-45" />
          </div>
          <Button onClick={toggleFullscreen} aria-label="Toggle fullscreen">
            Fullscreen
            <CornersOutIcon />
          </Button>
        </div>
      </div>
    </Suspense>
  );
}
