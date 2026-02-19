import type { ComponentProps, ReactNode } from "react";
import { useState } from "react";
import { CheckIcon, SquareIcon } from "@phosphor-icons/react";
import clsx from "clsx";

type Props = {
  // checked state
  value?: boolean;
  // on checked state change
  onChange?: (value: boolean) => void;
  // label content
  children: ReactNode;
} & Pick<ComponentProps<"label">, "className"> &
  Pick<ComponentProps<"input">, "required" | "name">;

export default function Checkbox({
  value,
  onChange,
  children,
  className,
  ...props
}: Props) {
  const [localValue, setLocalValue] = useState(value ?? false);

  return (
    <label
      className={clsx(
        "group flex-row items-center rounded-md p-2 outline-2 outline-offset-2 outline-transparent focus-within:outline-theme hover:bg-theme/10",
        className,
      )}
    >
      <div className="relative size-6 *:absolute *:inset-0">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => {
            const value = event.currentTarget.checked;
            setLocalValue(value);
            onChange?.(value);
          }}
          className="opacity-0"
          {...props}
        />
        {localValue ? (
          <CheckIcon className="text-theme" />
        ) : (
          <SquareIcon className="text-theme" />
        )}
      </div>
      {children}
    </label>
  );
}
