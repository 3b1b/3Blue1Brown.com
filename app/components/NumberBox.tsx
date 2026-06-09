import type { ReactNode } from "react";
import { NumberField } from "@base-ui/react";
import { CaretUpDownIcon, MinusIcon, PlusIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Help from "~/components/Help";

type Props = {
  // label
  label: string;
  // required
  required?: boolean;
  // help content
  help?: ReactNode;
  // min value
  min?: number;
  // max value
  max?: number;
  // step size
  step?: number;
  // number state
  value?: number;
  // on number state change
  onChange?: (value: number) => void;
  // class on root
  className?: string;
};

// number input box
export default function NumberBox({
  label,
  required,
  help,
  min,
  max,
  step,
  value,
  onChange,
  className,
}: Props) {
  return (
    <NumberField.Root
      min={min}
      max={max}
      step={step}
      value={value}
      onValueChange={(value) => value !== null && onChange?.(value)}
      className={clsx("flex flex-col gap-2", className)}
      // eslint-disable-next-line -- control will be rendered as child of label
      render={(props) => <label {...props} />}
    >
      <div className="flex items-center gap-2">
        {label}
        {help && <Help>{help}</Help>}
        {required && <span className="text-error">*</span>}
      </div>
      <NumberField.Group className="flex min-w-0 gap-2 rounded-md border border-gray bg-white p-3 leading-none text-black change-ring focus-within:outline-theme hover:outline-theme">
        <NumberField.Input className="w-12 grow outline-none" />
        <NumberField.Decrement className="text-xs hover:text-theme">
          <MinusIcon />
        </NumberField.Decrement>
        <NumberField.Increment className="text-xs hover:text-theme">
          <PlusIcon />
        </NumberField.Increment>
        <NumberField.ScrubArea
          className="cursor-ns-resize text-xs transition hover:text-theme"
          direction="vertical"
        >
          <CaretUpDownIcon />
        </NumberField.ScrubArea>
      </NumberField.Group>
    </NumberField.Root>
  );
}
