import type { ReactNode } from "react";
import { QuotesIcon } from "@phosphor-icons/react";
import clsx from "clsx";

type Props = {
  bg?: boolean;
  children: ReactNode;
  name?: ReactNode;
  className?: string;
};

// box with quote and attribution
export default function Quote({ bg = true, children, name, className }: Props) {
  return (
    <blockquote
      className={clsx(
        "relative flex flex-col justify-center gap-4 **:text-center **:text-balance",
        bg ? "p-8" : "border-0 bg-transparent p-4",
        className,
      )}
    >
      <QuotesIcon className="absolute top-1 left-1 icon -scale-x-100 text-xl opacity-10" />
      {children}
      {name && <div className="mt-auto italic">&mdash; {name}</div>}
      <QuotesIcon className="absolute right-1 bottom-1 icon text-xl opacity-10" />
    </blockquote>
  );
}
