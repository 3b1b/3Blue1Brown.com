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
    <_Collapsible.Root className="contents" open={open} onOpenChange={setOpen}>
      <_Collapsible.Trigger
        className={clsx(
          "justify-start gap-2 rounded-md bg-current/5 p-2 font-medium hocus:bg-theme/15",
          className,
        )}
      >
        <CaretRightIcon
          className={clsx("icon transition", open && "rotate-90")}
        />
        {title}
      </_Collapsible.Trigger>
      <_Collapsible.Panel
        hiddenUntilFound
        className={clsx(
          "flex h-(--collapsible-panel-height) shrink-0 flex-col gap-8 overflow-hidden px-8 py-2 transition-[height]",
          open ? "" : "sr-only",
        )}
      >
        {children}
      </_Collapsible.Panel>
    </_Collapsible.Root>
  );
}
