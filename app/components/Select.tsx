import type { ComponentProps } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import clsx from "clsx";

type Props<O extends Option> = {
  // pass with "as const"
  options: readonly O[];
  // selected option state
  value?: O["value"];
  // on selected option state change
  onChange?: (value: O["value"]) => void;
} & Omit<ComponentProps<"select">, "value" | "onChange">;

type Option<Value = string> = {
  value: Value;
  label?: string;
};

// dropdown single-select
export default function Select<O extends Option>({
  value,
  onChange,
  options,
  className,
  ...props
}: Props<O>) {
  return (
    <div
      className={clsx(
        "relative flex grow rounded-md bg-current/5 font-medium hocus:bg-theme/15",
        className,
      )}
    >
      <select
        className="size-full appearance-none rounded-md p-2 pr-8"
        value={value}
        onChange={(event) => onChange?.(event.currentTarget.value)}
        {...props}
      >
        {options.map((option, index) => (
          <option key={index} value={option.value}>
            {option.label ?? option.value}
          </option>
        ))}
      </select>
      <CaretDownIcon className="absolute top-1/2 right-2 icon -translate-y-1/2" />
    </div>
  );
}
