import type { ReactNode } from "react";
import { useState } from "react";
import { CaretDoubleDownIcon, CaretDoubleUpIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import { preserveScroll } from "~/util/dom";
import { autoHeight } from "~/util/hooks";

type Props = {
  // class on content
  className?: string;
  // content to show partially
  children: ReactNode;
};

// height limit, in pixels
const limit = 300;

// show partial content with fade, with button to reveal more
export default function ShowPartial({ className, children }: Props) {
  const [open, setOpen] = useState(false);
  const [enabled, setEnabled] = useState(true);

  if (!enabled) return children;

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        ref={(element) => {
          if (!element) return;
          // height of full content
          const content = element.scrollHeight;
          // if content is short enough, just disable component˝
          if (content <= limit) {
            setEnabled(false);
            return;
          }
          autoHeight(element, open);
        }}
        className={clsx(
          "flex flex-col gap-8 overflow-hidden transition-all",
          open ? "" : "to-transparent mask-b-from-50%",
          className,
        )}
      >
        {children}
      </div>
      <Button
        onClick={(event) => {
          setOpen(!open);
          if (open) preserveScroll(event.currentTarget);
        }}
        size="sm"
        color="light"
      >
        {open ? <CaretDoubleUpIcon /> : <CaretDoubleDownIcon />}
        {open ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
}
