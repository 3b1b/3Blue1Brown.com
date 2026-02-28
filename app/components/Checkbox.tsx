import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { CheckIcon, SquareIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Help from "~/components/Help";

type Props = {
  // checked state
  value?: boolean;
  // on checked state change
  onChange?: (value: boolean) => void;
  // label content
  children: ReactNode;
  // help content
  help?: ReactNode;
} & Pick<ComponentProps<"label">, "className"> &
  Pick<ComponentProps<"input">, "required" | "name">;

export default function Checkbox({
  value,
  onChange,
  children,
  className,
  help,
  ...props
}: Props) {
  const [localValue, setLocalValue] = useState(value ?? false);

  return (
    <label
      className={clsx(
        "group flex flex-row items-center gap-2 rounded-md focus-ring p-2 hocus:bg-theme/15",
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
        {localValue ? (
          <CheckIcon className="text-theme" />
        ) : (
          <SquareIcon className="text-theme" />
        )}
      </div>
      {children}
      {help && <Help>{help}</Help>}
      {props.required && <span className="text-error">*</span>}
    </label>
  );
}
