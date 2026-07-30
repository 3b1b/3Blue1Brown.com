import type { ComponentType, LazyExoticComponent } from "react";
import { Suspense, useRef } from "react";
import { useLocation } from "react-router";
import { CornersOutIcon } from "@phosphor-icons/react";
import { useFullscreen } from "@reactuses/core";
import clsx from "clsx";
import Button from "~/components/Button";
import { useClient } from "~/util/hooks";

type Props<ComponentProps extends Record<string, unknown>> = {
  // lazy-loaded component
  Component: LazyExoticComponent<ComponentType<ComponentProps>>;
  // whether to render standard interactive controls
  controls?: boolean;
} &
  // rest of props get passed to lazy component
  ComponentProps;

// interactive component for lessons
export default function Interactive<
  ComponentProps extends Record<string, unknown>,
>({ Component, controls = true, ...props }: Props<ComponentProps>) {
  const ref = useRef<HTMLDivElement>(null);

  // fullscreen control
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(ref);

  const location = useLocation();

  // don't render on server
  if (!useClient()) return null;

  // render lazy component
  let children = <Component {...(props as unknown as ComponentProps)} />;

  // wrap with controls
  if (controls)
    children = (
      <div className="relative isolate flex flex-col gap-4 py-8">
        <div className="absolute top-0 -z-10 h-full w-screen self-center bg-secondary/10">
          <Button
            className="absolute bottom-0 left-0"
            onClick={toggleFullscreen}
            aria-label="Toggle fullscreen"
          >
            <CornersOutIcon />
          </Button>
        </div>
        <div
          ref={ref}
          className={clsx(
            "relative isolate flex flex-col items-center justify-center-safe gap-8 [&_.p5Canvas]:h-[unset]! [&_.p5Canvas]:max-w-full [&_.react-p5]:max-w-full",
            isFullscreen && "bg-white",
          )}
        >
          {children}
        </div>
      </div>
    );

  return (
    <Suspense
      fallback="Browser-only interactive"
      // https://github.com/remix-run/react-router/issues/12474
      // avoids very specific bug:
      // only in chrome
      // only on pages w/ <Suspense>
      // useLocation (used in header lesson search topic change) fails to be reactive
      key={location.key}
    >
      {children}
    </Suspense>
  );
}
