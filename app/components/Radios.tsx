import type { ReactNode } from "react";
import { Radio, RadioGroup } from "@base-ui/react";
import { CircleIcon, RadioButtonIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Help from "~/components/Help";

type Props<O extends Option> = {
  // label content
  label: ReactNode;
  // help content
  help?: ReactNode;
  // required for form submission
  required?: boolean;
  // pass with "as const"
  options: readonly O[];
  // selected option state
  value?: O["value"];
  // on selected option state change
  onChange?: (value: O["value"]) => void;
};

type Option<Value = string> = {
  value: Value;
  label?: ReactNode;
  className?: string;
};

// radio buttons
export default function Radios<O extends Option>({
  label,
  help,
  required,
  options,
  value,
  onChange,
}: Props<O>) {
  return (
    <RadioGroup
      className="flex flex-col gap-8"
      value={value}
      onValueChange={onChange}
      required={required}
    >
      <label className="flex items-center gap-2">
        {label}
        {help && <Help>{help}</Help>}
        {required && <span className="text-error">*</span>}
      </label>

      <div className="flex flex-col gap-2">
        {options.map(({ value, label, className }, index) => (
          <Radio.Root
            key={index}
            value={value}
            render={(props, { checked }) => (
              <div
                className={clsx(
                  "flex flex-row items-center gap-4 rounded-md p-2 change-ring outline-none focus-within:outline-theme hocus:bg-theme/15",
                  className,
                )}
                {...props}
              >
                {checked ? (
                  <RadioButtonIcon className="icon text-theme" />
                ) : (
                  <CircleIcon className="icon text-gray" />
                )}
                {label ?? value}
              </div>
            )}
          />
        ))}
      </div>
    </RadioGroup>
  );
}
