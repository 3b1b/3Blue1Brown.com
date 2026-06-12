import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { useRef } from "react";
import { XIcon } from "@phosphor-icons/react";
import { useElementBounding, useMergedRefs } from "@reactuses/core";
import clsx from "clsx";
import Help from "~/components/Help";

type Props = Base & (Single | Multi);

type Base = {
  // label, optional if placeholder or aria-label present
  label?: ReactNode;
  // help content
  help?: ReactNode;
  // required for form submission
  required?: boolean;
  // hint icon to show on side
  icon?: ReactElement;
  // text state
  value?: string;
  // on text state change
  onChange?: (value: string) => void;
};

type Single = {
  // single line
  multi?: false;
} & Omit<ComponentPropsWithRef<"input">, "value" | "onChange">;

type Multi = {
  // multi-line
  multi: true;
} & Omit<ComponentPropsWithRef<"textarea">, "value" | "onChange">;

// single or multi-line text input box
export default function TextBox({
  ref: passedRef,
  label,
  help,
  multi,
  icon,
  value,
  onChange,
  className,
  required,
  ...props
}: Props) {
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const mergedRef = useMergedRefs(inputRef, passedRef);
  const sideRef = useRef<HTMLDivElement>(null);

  // side elements
  let side: ReactNode = "";
  if (!!value)
    side = (
      <button
        className="hover:text-theme"
        onClick={() => {
          if (inputRef.current) inputRef.current.value = "";
          onChange?.("");
        }}
        aria-label="Clear text"
      >
        <XIcon />
      </button>
    );
  else if (icon) side = <div>{icon}</div>;

  // extra padding needed for side element
  const sidePadding = useElementBounding(sideRef).width;

  // classes on input
  const inputClass =
    "grow rounded-md border border-gray bg-white p-3 text-black change-ring hocus:outline-theme";

  // input field
  const input = multi ? (
    <textarea
      ref={mergedRef}
      rows={6}
      className={clsx(inputClass, "min-h-12 grow resize")}
      style={{ paddingRight: sidePadding ? sidePadding : "" }}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      {...(props as Multi)}
    />
  ) : (
    <input
      ref={mergedRef}
      className={clsx(inputClass, "h-12")}
      style={{ paddingRight: sidePadding ? sidePadding : "" }}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      {...(props as Single)}
    />
  );

  return (
    <label className={clsx("flex max-w-full flex-col gap-2", className)}>
      {(label || help || required) && (
        <div className="flex items-center gap-2">
          {label}
          {help && <Help>{help}</Help>}
          {required && <span className="text-error">*</span>}
        </div>
      )}

      <div className="relative flex max-w-full items-start">
        {input}

        <div
          ref={sideRef}
          className="absolute top-0 right-0 flex items-start text-gray *:grid *:size-12 *:place-items-center"
        >
          {side}
        </div>
      </div>
    </label>
  );
}
