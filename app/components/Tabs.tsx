import type { ReactElement, ReactNode } from "react";
import { Children, cloneElement, isValidElement } from "react";
import { Tabs as _Tabs } from "@base-ui/react";
import clsx from "clsx";
import { omit } from "lodash-es";
import Button from "~/components/Button";

type Props = {
  // default selected tab index
  defaultIndex?: number;
  // tabs (titles and content)
  children?: ReactNode;
  // class on root
  className?: string;
} & Omit<_Tabs.Root.Props, "children">;

// tabs
export default function Tabs({
  defaultIndex,
  children,
  className,
  ...props
}: Props) {
  /** filter out conditional or invalid elements */
  const panels = Children.toArray(children).filter(
    (child): child is ReactElement<PanelProps> =>
      isValidElement(child) && child.type === Panel,
  );

  return (
    <_Tabs.Root
      className={clsx("flex flex-col items-center gap-4", className)}
      defaultValue={defaultIndex}
      {...props}
    >
      {/* buttons */}
      <_Tabs.List className="relative flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
        {panels.map((panel, index) => (
          <_Tabs.Tab
            key={index}
            value={index}
            render={(props) => (
              <Button {...props} color="none" className="rounded-b-none" />
            )}
          >
            {panel.props.title}
          </_Tabs.Tab>
        ))}
        <_Tabs.Indicator className="absolute right-(--active-tab-right) bottom-(--active-tab-bottom) left-(--active-tab-left) h-0.5 rounded-md bg-theme transition-all" />
      </_Tabs.List>

      {/* panels */}
      {panels.map((panel, index) => cloneElement(panel, { index }))}
    </_Tabs.Root>
  );
}

type PanelProps = {
  // tab button content
  title: ReactNode;
  // index of child
  index?: number;
} & Omit<Partial<_Tabs.Panel.Props>, "title" | "index">;

// tab panel content
export function Panel({ index, ...props }: PanelProps) {
  return (
    <_Tabs.Panel className="contents" {...omit(props, "title")} value={index} />
  );
}
