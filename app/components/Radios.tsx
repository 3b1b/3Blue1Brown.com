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
  // pass with "as const"
  options: readonly O[];
  // selected option state
  value?: O["value"];
  // on selected option state change
  onChange?: (value: O["value"]) => void;
  // required
  required?: boolean;
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
  options,
  value,
  onChange,
  required,
}: Props<O>) {
  return (
    <RadioGroup
      className="flex flex-col gap-8"
      value={value}
      onValueChange={onChange}
      required={required}
    >
      <label>
        <p className="flex items-center gap-2">
          {label}
          {help && <Help>{help}</Help>}
          {required && <span className="text-error">*</span>}
        </p>
      </label>

      <div className="flex flex-col gap-2">
        {options.map(({ value, label, className }, index) => (
          <label
            key={index}
            className={clsx(
              "rounded-md focus-ring p-2 hocus:bg-theme/15",
              className,
            )}
          >
            <Radio.Root
              value={value}
              render={(props, { checked }) => (
                <span {...props} className="flex flex-row items-center gap-4">
                  {checked ? (
                    <RadioButtonIcon className="icon text-theme" />
                  ) : (
                    <CircleIcon className="icon text-gray" />
                  )}
                  {label ?? value}
                </span>
              )}
            />
          </label>
        ))}
      </div>
    </RadioGroup>
  );
}
