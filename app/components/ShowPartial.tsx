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
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col items-center gap-8">
      <div
        className={clsx(
          "flex flex-col gap-8 overflow-hidden",
          show ? "" : "max-h-50 to-transparent mask-b-from-50%",
          className,
        )}
      >
        {children}
      </div>
      <Button
        onClick={(event) => {
          setShow(!show);
          if (show) preserveScroll(event.currentTarget);
        }}
        size="sm"
        color="light"
      >
        {show ? <CaretDoubleUpIcon /> : <CaretDoubleDownIcon />}
        {show ? "Show Less" : "Show More"}
      </Button>
    </div>
  );
}
