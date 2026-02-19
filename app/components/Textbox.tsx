import type { ComponentPropsWithRef, ReactElement, ReactNode } from "react";
import { useRef } from "react";
import { XIcon } from "@phosphor-icons/react";
import { useElementBounding, useMergedRefs } from "@reactuses/core";
import clsx from "clsx";

type Props = Base & (Single | Multi);

type Base = {
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
const Textbox = ({
  ref: passedRef,
  multi,
  icon,
  value,
  onChange,
  className,
  ...props
}: Props) => {
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
      className="grow resize rounded-md border border-light-gray bg-white p-2 outline-2 outline-offset-2 outline-transparent hover:outline-theme"
      style={{ paddingRight: sidePadding ? sidePadding : "" }}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      {...(props as Multi)}
    />
  ) : (
    <input
      ref={mergedRef}
      className="grow rounded-md border border-light-gray bg-white p-2 outline-2 outline-offset-2 outline-transparent hover:outline-theme"
      style={{ paddingRight: sidePadding ? sidePadding : "" }}
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      {...(props as Single)}
    />
  );
  return (
    <>
      <div
        className={clsx(`
          relative flex items-start
          ${className}
        `)}
      >
        {input}
        <div
          ref={sideRef}
          className="absolute top-0 right-0 flex items-start text-dark-gray *:grid *:size-[calc(var(--leading-normal)*1em+--spacing(4)+2px)] *:place-items-center *:p-0"
        >
          {side}
        </div>
      </div>
    </>
  );
};

export default Textbox;
