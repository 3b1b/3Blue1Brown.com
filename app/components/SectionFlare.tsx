import { useRef } from "react";
import clsx from "clsx";
import { clamp } from "lodash-es";
import { useParallax } from "~/util/hooks";

type Props = {
  offset?: number;
  className?: string;
};

// section bg with animated flare
export default function SectionFlare({ className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const percent = useParallax(ref);

  return (
    <div
      ref={ref}
      className={clsx(
        "absolute inset-y-0 -z-10 skew-x-10 bg-current",
        className,
      )}
      style={{
        opacity: clamp((1 - percent) * 0.25, 0, 0.25),
        left: `${-10 + percent * 25}%`,
        right: `${-10 + percent * 25}%`,
      }}
    />
  );
}
