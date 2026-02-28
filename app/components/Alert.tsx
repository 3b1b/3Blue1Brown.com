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
  // optionally override custom icon
  icon?: ReactElement;
  // alert content
  children: ReactNode;
  // class on root element
  className?: string;
};

// available categories of alerts and associated styles
export const types = {
  info: {
    color: "var(--color-theme)",
    icon: <InfoIcon />,
  },
  loading: {
    color: "var(--color-gray)",
    icon: <CircleNotchIcon className="icon animate-spin" />,
  },
  success: {
    color: "var(--color-success)",
    icon: <CheckCircleIcon />,
  },
  warning: {
    color: "var(--color-warning)",
    icon: <WarningCircleIcon />,
  },
  error: {
    color: "var(--color-error)",
    icon: <WarningDiamondIcon />,
  },
};

// alert type
type Type = keyof typeof types;

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
        "flex items-center gap-4 border-l-2 border-current bg-current/10 p-4 leading-loose",
        className,
      )}
      style={{ color: types[type].color }}
      role="alert"
    >
      {icon ?? types[type].icon}
      <div className="flex flex-col gap-4 text-black">{children}</div>
    </div>
  );
}

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
