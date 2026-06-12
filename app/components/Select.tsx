import type { ComponentProps, ReactNode } from "react";
import { CaretDownIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Help from "~/components/Help";

type Props<O extends Option> = {
  // label content, optional if aria-label present
  label?: ReactNode;
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
} & Omit<ComponentProps<"select">, "value" | "onChange">;

type Option<Value = string> = {
  value: Value;
  label?: string;
};

// dropdown single-select
export default function Select<O extends Option>({
  label,
  help,
  required,
  value,
  onChange,
  options,
  className,
  ...props
}: Props<O>) {
  return (
    <label className="flex flex-col gap-2">
      {(label || help || required) && (
        <div className="flex items-center gap-2">
          {label}
          {help && <Help>{help}</Help>}
          {required && <span className="text-error">*</span>}
        </div>
      )}
      <div
        className={clsx(
          "relative flex grow rounded-md bg-light-gray font-medium transition hocus:bg-theme/15",
          className,
        )}
      >
        <select
          className="size-full h-12 appearance-none rounded-md p-3 pr-8"
          value={value}
          onChange={(event) => onChange?.(event.currentTarget.value)}
          onKeyDown={(event) => {
            const element = event.currentTarget;

            const left = event.key === "ArrowLeft";
            const right = event.key === "ArrowRight";

            // allow quick scrub with left/right when focused
            if (left || right) {
              event.preventDefault();
              if (left && element.selectedIndex > 0) element.selectedIndex--;

              if (right && element.selectedIndex < options.length - 1)
                element.selectedIndex++;

              onChange?.(options[element.selectedIndex]!.value);
            }
          }}
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
    </label>
  );
}
