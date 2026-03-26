import type { ReactNode } from "react";
import { isValidElement } from "react";
import { Popover } from "@base-ui/react";
import clsx from "clsx";

type Props = {
  // trigger element that opens tooltip
  trigger: ReactNode;
  // whether to open with click instead of hover
  click?: boolean;
  // class on popup box
  className?: string;
  // tooltip content
  children: ReactNode;
};

/** popup of content on hover or click */
export default function Tooltip({
  trigger,
  children,
  click,
  className,
}: Props) {
  // prevent if trigger disabled
  if (
    isValidElement(trigger) &&
    typeof trigger.props === "object" &&
    trigger.props !== null &&
    "aria-disabled" in trigger.props &&
    trigger.props["aria-disabled"]
  )
    return trigger;

  return (
    <Popover.Root>
      <Popover.Trigger
        openOnHover={!click}
        delay={100}
        render={
          isValidElement(trigger) ? (
            // if element, render element
            trigger
          ) : (
            // if text, wrap in button and give hoverable indication
            <button className="underline decoration-dashed">{trigger}</button>
          )
        }
      />
      <Popover.Portal>
        <Popover.Positioner
          side="top"
          sideOffset={10}
          collisionPadding={20}
          className="z-50"
          collisionAvoidance={{
            side: "flip",
            align: "shift",
            fallbackAxisSide: "none",
          }}
        >
          <Popover.Popup
            className={clsx(
              "flex max-h-(--available-height) w-max max-w-[min(var(--available-width),--spacing(200))] flex-col gap-2 overflow-y-auto overscroll-none rounded-md bg-white p-4 shadow-md",
              className,
            )}
          >
            <Popover.Arrow className="[clip-path:polygon(-100%_-10%,201%_-10%,100%_100%,0_100%)] data-[side=bottom]:bottom-full data-[side=bottom]:rotate-180 data-[side=left]:left-full data-[side=left]:-rotate-90 data-[side=right]:right-full data-[side=right]:rotate-90 data-[side=top]:top-full">
              <div className="size-3 -translate-y-1/2 rotate-45 bg-white shadow-sm" />
            </Popover.Arrow>
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
