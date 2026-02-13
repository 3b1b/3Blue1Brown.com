import { useRef } from "react";
import clsx from "clsx";
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
      className={clsx("absolute inset-0 -z-10 skew-x-25 bg-current", className)}
      style={{
        translate: `${percent * 10}% 0`,
        opacity: (1 - Math.abs(-percent)) * 0.15,
      }}
    />
  );
}
