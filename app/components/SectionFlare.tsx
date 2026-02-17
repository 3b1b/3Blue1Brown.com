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
  let percent = useParallax(ref);
  percent = clamp(percent ** 4, 0, 1);

  return (
    <div
      ref={ref}
      className={clsx(
        `
          absolute top-1/2 left-1/2 -z-10 box-content flex size-full
          -translate-1/2 skew-x-5 bg-current/10
        `,
        className,
      )}
      style={{ maxWidth: (1 - Math.abs(percent)) * 1200, opacity: 1 - percent }}
    >
      <div className="w-8 border-3 border-r-0 border-current/25" />
      <div className="grow" />
      <div className="w-8 border-3 border-l-0 border-current/25" />
    </div>
  );
}
