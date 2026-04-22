import type { ReactElement, ReactNode } from "react";
import {
  CheckCircleIcon,
  CircleNotchIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningDiamondIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { getVariants } from "~/util/misc";

type Props = {
  // type of alert, determines styling
  type?: Type;
  // optionally use custom icon
  icon?: ReactElement;
  // class on root
  className?: string;
  // alert content
  children: ReactNode;
};

// available categories of alerts and associated styles
export const types = {
  info: {
    color: "text-theme bg-theme/15",
    icon: <InfoIcon />,
  },
  loading: {
    color: "text-gray bg-light-gray",
    icon: <CircleNotchIcon className="icon animate-spin" />,
  },
  success: {
    color: "text-success bg-success/10",
    icon: <CheckCircleIcon />,
  },
  warning: {
    color: "text-warning bg-warning/10",
    icon: <WarningCircleIcon />,
  },
  error: {
    color: "text-error bg-error/10",
    icon: <WarningDiamondIcon />,
  },
};

// alert type
export type Type = keyof typeof types;

// box with icon and text
export default function Alert({
  type = "info",
  icon,
  className,
  children,
}: Props) {
  return (
    <div
      className={clsx(
        "flex items-center gap-4 rounded-r-md border-l-2 border-current p-4 leading-loose",
        className,
        types[type].color,
      )}
      role="alert"
    >
      {icon ?? types[type].icon}
      <div className="flex flex-col gap-4 text-black">{children}</div>
    </div>
  );
}

// for testbed page
export function Demo({ children }: { children: ReactNode }) {
  const variants = getVariants({ type: Object.keys(types) as Type[] });

  return (
    <div className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
      {variants.map((props, index) => (
        <Alert key={index} {...props}>
          {children}
        </Alert>
      ))}
    </div>
  );
}
