import type { ComponentProps, ReactNode } from "react";
import { useRef, useState } from "react";
import { Collapsible as _Collapsible } from "@base-ui/react";
import { CaretRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { useAutoHeight, usePrinting } from "~/util/hooks";

type Props = {
  // button content
  title: ReactNode;
  // panel content
  children: ReactNode;
} & Omit<ComponentProps<"button">, "title">;

// aka disclosure, accordion, etc.
export default function Collapsible({ title, children, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  // state
  let [open, setOpen] = useState(false);

  // animate height on open/close
  useAutoHeight(ref, open);

  if (usePrinting()) open = true;

  return (
    <_Collapsible.Root
      className="flex flex-col gap-8"
      open={open}
      onOpenChange={setOpen}
    >
      <_Collapsible.Trigger
        className={clsx(
          "justify-start gap-2 rounded-md bg-light-gray p-2 text-left font-medium hocus:bg-theme/15",
          className,
        )}
      >
        <CaretRightIcon
          className={clsx("icon transition", open && "rotate-90")}
        />
        {title}
      </_Collapsible.Trigger>
      <_Collapsible.Panel
        ref={ref}
        hiddenUntilFound
        className={clsx(
          "flex shrink-0 flex-col gap-8 overflow-y-clip px-8 py-2 transition-all",
          open ? "" : "pointer-events-none -mb-12",
        )}
      >
        {children}
      </_Collapsible.Panel>
    </_Collapsible.Root>
  );
}
