import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import Help from "~/components/Help";

type Props = {
  // label, optional if aria-label present
  label?: ReactNode;
  // help content
  help?: ReactNode;
  // required for form submission
  required?: boolean;
  // color state
  value?: string;
  // on color state change
  onChange?: (value: string) => void;
} & Omit<ComponentProps<"input">, "onChange">;

export function ColorSelect({
  label,
  help,
  required,
  value,
  onChange,
  className,
  ...props
}: Props) {
  return (
    <label className={clsx("flex max-w-full flex-col gap-2", className)}>
      {(label || help || required) && (
        <div className="flex items-center gap-2">
          {label}
          {help && <Help>{help}</Help>}
          {required && <span className="text-error">*</span>}
        </div>
      )}

      <div
        className="size-8 rounded-full border change-ring transition focus-within:outline-theme hover:outline-theme"
        style={{ backgroundColor: value }}
      >
        <input
          type="color"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          {...props}
          className="cursor-pointer opacity-0"
        />
      </div>
    </label>
  );
}
