import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { Collapsible as _Collapsible } from "@base-ui/react";
import { CaretRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";

type Props = {
  // button content
  title: ReactNode;
  // panel content
  children: ReactNode;
} & Omit<ComponentProps<"button">, "title">;

// aka disclosure, accordion, etc.
export default function Collapsible({ title, children, className }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <_Collapsible.Root
      className="flex flex-col gap-8"
      open={open}
      onOpenChange={setOpen}
    >
      <_Collapsible.Trigger
        className={clsx(
          "justify-start gap-2 rounded-md bg-light-gray p-2 font-medium hocus:bg-theme/10",
          className,
        )}
      >
        <CaretRightIcon
          className={clsx("icon transition", open && "rotate-90")}
        />
        {title}
      </_Collapsible.Trigger>
      <_Collapsible.Panel
        ref={(element) => {
          if (!element) return;
          // calculate height to transition to when opening
          element.style.maxHeight = open ? element.scrollHeight + "px" : "";
        }}
        hiddenUntilFound
        className={clsx(
          "flex max-h-0 shrink-0 flex-col gap-8 overflow-hidden px-8 py-2 transition-all",
          open ? "" : "pointer-events-none -mb-12 opacity-0",
        )}
      >
        {children}
      </_Collapsible.Panel>
    </_Collapsible.Root>
  );
}
