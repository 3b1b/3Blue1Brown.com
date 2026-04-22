import type { ReactElement, ReactNode } from "react";
import { Children, cloneElement } from "react";
import { Tabs as _Tabs } from "@base-ui/react";
import clsx from "clsx";
import Button from "~/components/Button";

type Props = {
  // content of each tab
  tabs: ReactNode[];
  // content panels
  children?: ReactElement<{ index: number } & _Tabs.Panel.Props>[];
  // class on root
  className?: string;
} & Omit<_Tabs.Root.Props, "children">;

// tabs
export default function Tabs({ tabs, children, className }: Props) {
  return (
    <_Tabs.Root className={clsx("flex flex-col items-center gap-4", className)}>
      <_Tabs.List className="relative flex flex-wrap items-center justify-center gap-4">
        {tabs.map((tab, index) => (
          <_Tabs.Tab
            key={index}
            value={index}
            render={(props) => (
              <Button {...props} color="none" className="rounded-b-none" />
            )}
          >
            {tab}
          </_Tabs.Tab>
        ))}
        <_Tabs.Indicator className="absolute right-(--active-tab-right) bottom-(--active-tab-bottom) left-(--active-tab-left) h-0.5 rounded-md bg-theme transition-all" />
      </_Tabs.List>
      {Children.map(children ?? [], (child, index) =>
        cloneElement(child, { index }),
      )}
    </_Tabs.Root>
  );
}

type PanelProps = {
  // index of child
  index?: number;
} & Partial<_Tabs.Panel.Props>;

// tab panel content
export function Panel({ index, ...props }: PanelProps) {
  return <_Tabs.Panel className="contents" {...props} value={index} />;
}
