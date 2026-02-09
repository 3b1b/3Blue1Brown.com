import type { ComponentPropsWithRef } from "react";
import clsx from "clsx";

type Multi = {
  multi: true;
} & Omit<ComponentPropsWithRef<"textarea">, "onChange">;

type Single = {
  multi?: false;
} & Omit<ComponentPropsWithRef<"input">, "onChange">;

type Base = {
  onChange?: (value: string) => void;
};

type Props = Base & (Multi | Single);

export default function Textbox({
  multi = false,
  className,
  onChange,
  ...props
}: Props) {
  className = clsx(
    "rounded-md border border-current/25 bg-white p-2",
    className,
  );
  return multi ? (
    <textarea
      className={clsx("min-h-[calc(3lh+--spacing(4))]", className)}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      {...(props as ComponentPropsWithRef<"textarea">)}
    />
  ) : (
    <input
      className={className}
      onChange={(event) => onChange?.(event.currentTarget.value)}
      {...(props as ComponentPropsWithRef<"input">)}
    />
  );
}
