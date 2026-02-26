import type { ReactElement, ReactNode } from "react";
import { Popover } from "@base-ui/react";

type Props = {
  trigger: ReactElement<Record<string, unknown>>;
  children: ReactNode;
};

export default function Tooltip({ trigger, children }: Props) {
  return (
    <Popover.Root>
      <Popover.Trigger render={trigger} openOnHover />
      <Popover.Portal>
        <Popover.Positioner
          side="top"
          sideOffset={10}
          collisionPadding={20}
          className="z-20"
        >
          <Popover.Popup className="flex max-h-(--available-height) max-w-(--available-width) flex-col gap-2 rounded-md bg-white p-4 shadow-sm">
            <Popover.Arrow className="[clip-path:polygon(-100%_0,200%_0,100%_100%,0_100%)] data-[side=bottom]:bottom-full data-[side=bottom]:rotate-180 data-[side=left]:left-full data-[side=left]:-rotate-90 data-[side=right]:right-full data-[side=right]:rotate-90 data-[side=top]:top-full">
              <div className="size-2 -translate-y-1/2 rotate-45 bg-white shadow-sm" />
            </Popover.Arrow>
            {children}
          </Popover.Popup>
        </Popover.Positioner>
      </Popover.Portal>
    </Popover.Root>
  );
}
