import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import Help from "~/components/Help";

type Props = {
  // label
  label: string;
  // help content
  help?: ReactNode;
  // color state
  value?: string;
  // on color state change
  onChange?: (value: string) => void;
} & Omit<ComponentProps<"input">, "onChange">;

export function ColorSelect({
  label,
  help,
  value,
  onChange,
  className,
  ...props
}: Props) {
  return (
    <label
      className={clsx(
        "flex max-w-full flex-col gap-2",
        !label && "contents",
        className,
      )}
    >
      {(label || help) && (
        <div className="flex items-center gap-2">
          {label}
          {help && <Help>{help}</Help>}
          {props.required && <span className="text-error">*</span>}
        </div>
      )}
      <input
        type="color"
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="size-8 cursor-pointer"
        {...props}
      />
    </label>
  );
}
