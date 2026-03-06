import type { ReactNode } from "react";
import { useState } from "react";
import { CaretDoubleDownIcon, CaretDoubleUpIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import { preserveScroll } from "~/util/dom";

type Props = {
  // class on content
  className?: string;
  // content to show partially
  children: ReactNode;
};

// show partial content with fade, with button to reveal more
export default function ShowPartial({ className, children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        ref={(element) => {
          if (!element) return;
          // calculate height to transition to when opening
          element.style.maxHeight = open ? element.scrollHeight + "px" : "";
        }}
        className={clsx(
          "flex max-h-50 flex-col gap-8 overflow-hidden transition-all",
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
