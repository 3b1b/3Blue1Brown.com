import type { ReactNode } from "react";
import clsx from "clsx";
import classes from "./Marquee.module.css";

type Props = {
  // seconds for one full, seamless scroll cycle
  duration?: number;
  // items to scroll, repeated to fill the loop
  children: ReactNode;
  className?: string;
};

// horizontally auto-scrolling strip of content, looping seamlessly
export default function Marquee({ duration = 30, children, className }: Props) {
  return (
    <div
      className={clsx(
        "overflow-hidden mask-x-from-90% mask-x-to-100%",
        classes.wrapper,
        className,
      )}
    >
      <div
        className={clsx("flex w-max items-center gap-16", classes.track)}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex shrink-0 items-center gap-16">{children}</div>
        <div
          aria-hidden
          className={clsx(
            "flex shrink-0 items-center gap-16",
            classes.duplicate,
          )}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
