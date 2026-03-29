import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import { Dialog as _Dialog } from "@base-ui/react";
import { XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";

type Props = {
  // button element that triggers dialog to open
  trigger: ReactElement<Record<string, unknown>>;
  // dialog title
  title: ReactNode;
  // content at bottom of dialog
  bottomContent?: Content;
  // callback when dialog open state changes
  onChange?: (open: boolean) => void;
  // class on dialog container
  className?: string;
  // main content of dialog
  children: Content;
};

type Content = ReactNode | ((close: () => void, open: () => void) => ReactNode);

export default function Dialog({
  trigger,
  title,
  bottomContent,
  onChange,
  className,
  children,
}: Props) {
  const [isOpen, setOpen] = useState(false);

  const open = () => {
    setOpen(true);
    onChange?.(true);
  };
  const close = () => {
    setOpen(false);
    onChange?.(false);
  };

  // if content is a function, call it with open/close callbacks to get content, otherwise just return content
  const content = (content: Content) =>
    typeof content === "function" ? content(close, open) : content;

  // prevent if trigger disabled
  if (trigger.props["aria-disabled"]) return trigger;

  return (
    <_Dialog.Root
      open={isOpen}
      onOpenChange={(isOpen) => (isOpen ? open() : close())}
    >
      <_Dialog.Trigger render={trigger} />
      <_Dialog.Portal>
        <_Dialog.Backdrop className="fixed inset-0 z-30 bg-black/50 transition data-closed:opacity-0 data-ending-style:opacity-0 data-open:opacity-100 data-starting-style:opacity-0" />
        <_Dialog.Popup className="pointer-events-none fixed inset-0 z-30 grid place-items-center p-8 transition data-closed:opacity-0 data-ending-style:opacity-0 data-open:opacity-100 data-starting-style:opacity-0 max-md:p-4">
          <div
            ref={(element) => {
              if (!element) return;
              element
                .querySelector<HTMLInputElement>("input, textarea")
                ?.focus();
            }}
            className={clsx(
              "pointer-events-auto flex max-h-full min-h-0 w-full max-w-200 flex-col rounded-md bg-white",
              className,
            )}
          >
            {/* top, heading */}
            <div className="flex items-start gap-4 p-4 shadow-md">
              <_Dialog.Title className="justify-start text-left">
                {title}
              </_Dialog.Title>
              <_Dialog.Close render={<Button size="sm" />}>
                <XIcon />
              </_Dialog.Close>
            </div>

            {/* middle, main content */}
            <div className="flex flex-col gap-8 overflow-x-hidden overflow-y-auto p-8 max-md:p-4">
              {content(children)}
            </div>

            {/* bottom, actions */}
            {bottomContent && (
              <div className="flex flex-wrap items-center justify-center gap-4 p-4 shadow-md">
                {content(bottomContent)}
              </div>
            )}
          </div>
        </_Dialog.Popup>
      </_Dialog.Portal>
    </_Dialog.Root>
  );
}
