import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { useRef } from "react";
import { XIcon } from "@phosphor-icons/react";
import { useElementBounding, useMergedRefs } from "@reactuses/core";
import clsx from "clsx";
import Help from "~/components/Help";

type Props = Base & (Single | Multi);

type Base = {
  // label, optional if placeholder present
  label?: string;
  // help content
  help?: ReactNode;
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
} & Omit<ComponentPropsWithRef<"input">, "onChange">;

type Multi = {
  // multi-line
  multi: true;
} & Omit<ComponentPropsWithRef<"textarea">, "onChange">;

// single or multi-line text input box
export default function Textbox({
  ref: passedRef,
  label,
  help,
  multi,
  icon,
  value,
  onChange,
  className,
  ...props
}: Props) {
  const inputRef = useRef<HTMLTextAreaElement | HTMLInputElement>(null);
  const mergedRef = useMergedRefs(inputRef, passedRef);
  const sideRef = useRef<HTMLDivElement>(null);

  // side elements
  let side: ReactNode = "";
  if (value)
    side = (
      <button
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

  // input field
  const input = multi ? (
    <textarea
      ref={mergedRef}
      rows={6}
      className="grow resize rounded-md border border-gray bg-white p-2 hocus-ring"
      style={{ paddingRight: sidePadding ? sidePadding : "" }}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      {...(props as Multi)}
    />
  ) : (
    <input
      ref={mergedRef}
      className="grow scroll-mt-12 rounded-md border border-gray bg-white p-2 hocus-ring"
      style={{ paddingRight: sidePadding ? sidePadding : "" }}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      {...(props as Single)}
    />
  );
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
      <div className="relative flex max-w-full items-start">
        {input}
        <div
          ref={sideRef}
          className="absolute top-0 right-0 flex items-start text-gray *:grid *:size-[calc(var(--leading-normal)*1em+--spacing(4)+2px)] *:place-items-center *:p-0"
        >
          {side}
        </div>
      </div>
    </label>
  );
}
