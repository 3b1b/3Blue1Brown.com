import type { ReactNode } from "react";

type Props = {
  // class on element
  className?: string;
  // content
  children?: ReactNode;
};

// main content of page
export default function Main({ className, children }: Props) {
  return (
    <main id="content" className={className}>
      {children}
    </main>
  );
}
