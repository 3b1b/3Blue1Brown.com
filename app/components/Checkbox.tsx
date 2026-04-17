import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { CheckIcon, SquareIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Help from "~/components/Help";

type Props = {
  // help content
  help?: ReactNode;
  // checked state
  value?: boolean;
  // on checked state change
  onChange?: (value: boolean) => void;
  // label content
  children: ReactNode;
} & Pick<ComponentProps<"label">, "className"> &
  Pick<ComponentProps<"input">, "required" | "name" | "form">;

export default function Checkbox({
  help,
  value,
  onChange,
  className,
  children,
  ...props
}: Props) {
  const [localValue, setLocalValue] = useState(value ?? false);

  const Icon = localValue ? CheckIcon : SquareIcon;

  return (
    <label
      className={clsx(
        "group flex flex-row items-center gap-2 rounded-md p-2 focus-within-ring hocus:bg-theme/15",
        className,
      )}
    >
      <div className="relative size-6 *:absolute *:inset-0">
        <input
          type="checkbox"
          className="opacity-0"
          checked={value}
          onChange={(event) => {
            const value = event.currentTarget.checked;
            setLocalValue(value);
            onChange?.(value);
          }}
          {...props}
        />
        <Icon className="shrink-0 text-theme" />
      </div>
      {children}
      {help && <Help>{help}</Help>}
      {props.required && <span className="text-error">*</span>}
    </label>
  );
}
