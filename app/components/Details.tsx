import type { ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import clsx from "clsx";

type Props = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

export default function Details({ title, children, className }: Props) {
  return (
    <details className="[&[open]_.icon]:rotate-180">
      <summary
        className={clsx(
          "w-fit gap-2 rounded-full border border-dashed border-theme px-4 py-2 hover:bg-theme/10",
          className,
        )}
      >
        {title}
        <CaretDownIcon className="icon transition" />
      </summary>
      {children}
    </details>
  );
}
