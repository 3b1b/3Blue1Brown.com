import type { ReactNode } from "react";
import clsx from "clsx";
import classes from "./Marquee.module.css";

type Props = {
  // seconds for full scroll cycle
  duration?: number;
  // items to scroll
  children: ReactNode;
  className?: string;
};

// horizontally scrolling strip of items
export default function Marquee({ duration = 30, children, className }: Props) {
  return (
    <div
      className={clsx(
        "group overflow-hidden mask-x-from-90% mask-x-to-100%",
        className,
      )}
    >
      <div
        className={clsx(
          "flex w-max items-center *:flex *:shrink-0 *:items-center group-hover:[animation-play-state:paused]! motion-reduce:animate-none!",
          classes.track,
        )}
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="*:mr-16">{children}</div>
        <div aria-hidden className="*:mr-16 motion-reduce:hidden">
          {children}
        </div>
      </div>
    </div>
  );
}
