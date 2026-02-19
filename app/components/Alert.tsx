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
  type?: keyof typeof types;
  // optionally override custom icon
  icon?: ReactElement;
  // alert content
  children: ReactNode;
  // class on root element
  className?: string;
};

// available categories of alerts and associated styles
export const types = {
  info: { color: "var(--color-theme)", icon: <InfoIcon /> },
  loading: {
    color: "var(--color-gray)",
    icon: <CircleNotchIcon className="icon animate-spin" />,
  },
  success: { color: "var(--color-success)", icon: <CheckCircleIcon /> },
  warning: { color: "var(--color-warning)", icon: <WarningCircleIcon /> },
  error: { color: "var(--color-error)", icon: <WarningDiamondIcon /> },
};

// alert type
export type Type = keyof typeof types;

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
        "flex items-center gap-4 rounded-r-md border-l-2 border-current bg-current/10 p-4",
        className,
      )}
      style={{ color: types[type].color }}
    >
      {icon ?? types[type].icon}
      <div className="text-black">{children}</div>
    </div>
  );
}
