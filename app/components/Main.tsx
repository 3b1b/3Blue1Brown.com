import type { ReactNode } from "react";
import clsx from "clsx";

type Props = {
  // whether to apply alternating section background colors
  striped?: boolean;
  // class on element
  className?: string;
  // content
  children?: ReactNode;
};

// main content of page
export default function Main({ striped, className, children }: Props) {
  return (
    <main
      id="content"
      className={clsx(
        striped && "[&>section:nth-of-type(odd)]:bg-alt-white",
        className,
      )}
    >
      {children}
    </main>
  );
}
