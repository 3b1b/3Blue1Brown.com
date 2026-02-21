import type { ReactElement, ReactNode } from "react";
import {
  CheckCircleIcon,
  CircleNotchIcon,
  InfoIcon,
  WarningCircleIcon,
  WarningDiamondIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";

type Props = {
  // type of alert, determines styling
  type?: Type;
  // optionally override custom icon
  icon?: ReactElement;
  // alert content
  children: ReactNode;
  // class on root element
  className?: string;
};

const className = "relative top-0.5 icon";

// available categories of alerts and associated styles
export const types = {
  info: {
    color: "var(--color-theme)",
    icon: <InfoIcon className={className} />,
  },
  loading: {
    color: "var(--color-gray)",
    icon: <CircleNotchIcon className={clsx(className, "animate-spin")} />,
  },
  success: {
    color: "var(--color-success)",
    icon: <CheckCircleIcon className={className} />,
  },
  warning: {
    color: "var(--color-warning)",
    icon: <WarningCircleIcon className={className} />,
  },
  error: {
    color: "var(--color-error)",
    icon: <WarningDiamondIcon className={className} />,
  },
};

// alert type
type Type = keyof typeof types;

// box with icon and text */
export default function Alert({
  type = "info",
  icon,
  className,
  children,
}: Props) {
  return (
    <div
      role="alert"
      className={clsx(
        "flex items-start gap-4 rounded-r-md border-l-2 border-current bg-current/10 p-4",
        className,
      )}
      style={{ color: types[type].color }}
    >
      {icon ?? types[type].icon}
      <div className="flex flex-col gap-4 text-black">{children}</div>
    </div>
  );
}
