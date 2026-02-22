import type { ComponentProps } from "react";

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

export default function Select<O extends Option>({
  value,
  onChange,
  options,
  ...props
}: Props<O>) {
  return (
    <select
      className="grow rounded-md bg-gray/10 p-2 font-medium hocus:bg-theme/10"
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
  );
}
