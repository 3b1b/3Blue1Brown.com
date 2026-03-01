import type { ReactNode } from "react";
import { isValidElement } from "react";
import { Tooltip as _Tooltip } from "@base-ui/react";

type Props = {
  trigger: ReactNode;
  children: ReactNode;
};

export default function Tooltip({ trigger, children }: Props) {
  return (
    <_Tooltip.Root>
      <_Tooltip.Trigger
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
      <_Tooltip.Portal>
        <_Tooltip.Positioner
          side="top"
          sideOffset={10}
          collisionPadding={20}
          className="z-50"
        >
          <_Tooltip.Popup className="flex max-h-(--available-height) max-w-[min(--spacing(100),var(--available-width))] flex-col gap-2 rounded-md bg-white p-4 shadow-md">
            <_Tooltip.Arrow className="[clip-path:polygon(-100%_0,200%_0,100%_100%,0_100%)] data-[side=bottom]:bottom-full data-[side=bottom]:rotate-180 data-[side=left]:left-full data-[side=left]:-rotate-90 data-[side=right]:right-full data-[side=right]:rotate-90 data-[side=top]:top-full">
              <div className="size-3 -translate-y-1/2 rotate-45 bg-white shadow-sm" />
            </_Tooltip.Arrow>
            {children}
          </_Tooltip.Popup>
        </_Tooltip.Positioner>
      </_Tooltip.Portal>
    </_Tooltip.Root>
  );
}
