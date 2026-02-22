import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { Button, Disclosure, DisclosurePanel } from "react-aria-components";
import { CaretRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";

type Props = {
  // button content
  title: ReactNode;
  // panel content
  children: ReactNode;
} & Omit<ComponentProps<"button">, "title">;

export default function Collapsible({ title, children, className }: Props) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <Disclosure
      className="contents"
      isExpanded={isExpanded}
      onExpandedChange={setIsExpanded}
    >
      <Button
        className={clsx(
          "justify-start gap-2 rounded-md bg-gray/10 p-2 font-medium hocus:bg-theme/10",
          className,
        )}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CaretRightIcon
          className={clsx("icon transition", isExpanded && "rotate-90")}
        />
        {title}
      </Button>
      <DisclosurePanel
        className={clsx(
          "flex h-(--disclosure-panel-height) flex-col gap-8 overflow-hidden px-8 py-2 transition-[height]",
          isExpanded ? "" : "sr-only",
        )}
      >
        {children}
      </DisclosurePanel>
    </Disclosure>
  );
}
