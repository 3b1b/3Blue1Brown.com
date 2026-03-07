import type { ReactNode } from "react";

type Props = {
  // content to redact
  children: ReactNode;
};

// redact text, unredact on hover/focus
export default function Spoiler({ children }: Props) {
  return (
    <span className="blur-xs transition hocus:blur-none" tabIndex={0}>
      {children}
    </span>
  );
}
