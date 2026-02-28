import type { ReactElement, ReactNode } from "react";
import { useState } from "react";
import { Dialog as _Dialog } from "@base-ui/react";
import { XIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";

type Props = {
  trigger: ReactElement<Record<string, unknown>>;
  title: ReactNode;
  children: Content;
  bottomContent?: Content;
  onChange?: (open: boolean) => void;
};

type Content = ReactNode | ((close: () => void, open: () => void) => ReactNode);

export default function Dialog({
  trigger,
  title,
  children,
  bottomContent,
  onChange,
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
        <_Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50" />
        <_Dialog.Popup className="pointer-events-none fixed inset-0 z-50 grid place-items-center p-8">
          <div className="pointer-events-auto flex max-h-full min-h-0 max-w-400 min-w-0 flex-col rounded-md bg-white">
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
            <div className="flex flex-col gap-8 overflow-y-auto p-8">
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
