import type { ReactNode } from "react";

type Props = {
  // content to redact
  children: ReactNode;
};

// redact text, unredact on hover/focus
export default function Spoiler({ children }: Props) {
  return (
    <span className="bg-black transition hocus:bg-transparent" tabIndex={0}>
      {children}
    </span>
  );
}
