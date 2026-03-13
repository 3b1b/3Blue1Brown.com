import type { ComponentProps, ReactNode } from "react";
import clsx from "clsx";
import Help from "~/components/Help";

type Props = {
  // label, optional if placeholder present
  label?: string;
  // help content
  help?: ReactNode;
  // number state
  value?: number;
  // on number state change
  onChange?: (value: number) => void;
} & Omit<ComponentProps<"input">, "onChange">;

// number input box
export default function NumberBox({
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
        className="rounded-md border border-gray bg-white p-3 leading-none text-black hocus-ring"
        type="number"
        value={value}
        onChange={(event) => {
          const value = event.target.value;
          if (!value.trim()) return;
          const number = Number(value);
          if (isNaN(number)) return;
          onChange?.(number);
        }}
        {...props}
      />
    </label>
  );
}
