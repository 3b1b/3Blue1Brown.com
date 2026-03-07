import type { ComponentProps } from "react";
import { lazy, Suspense, useEffect, useState } from "react";
import clsx from "clsx";

const LazySketch = lazy(() => import("react-p5"));

// wrapper around p5 sketch to lazy load it
export default function Sketch({
  className,
  ...props
}: ComponentProps<typeof LazySketch>) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <Suspense>
      <LazySketch
        {...props}
        className={clsx("*:h-[unset]! *:w-full!", className)}
      />
    </Suspense>
  );
}
