import type { ComponentPropsWithRef, Ref } from "react";
import clsx from "clsx";
import Link from "~/components/Link";

type Props = Base & (_Link | _Button);

type Base = {
  color?: "none" | "light" | "theme" | "accent";
  size?: "small" | "medium";
};

type _Link = Omit<ComponentPropsWithRef<typeof Link>, "onClick">;

type _Button = ComponentPropsWithRef<"button">;

// looks like a button and either goes somewhere (link) or does something (button)
export default function Button({
  ref,
  color = "none",
  size = "medium",
  className,
  children,
  ...props
}: Props) {
  className = clsx(
    "inline-flex items-center justify-center gap-2 rounded-md font-sans no-underline [&_p]:contents [&_p]:leading-normal",
    color === "none" && "text-black hocus:bg-theme/10 hocus:text-theme",
    color === "light" &&
      "bg-theme/10 text-black hocus:bg-theme hocus:text-white",
    color === "theme" &&
      "bg-theme text-white hover-ring hocus:bg-black hocus:outline-black",
    color === "accent" &&
      "bg-black text-white hover-ring hocus:bg-theme hocus:outline-theme",
    size === "small" && "px-2 py-1",
    size === "medium" && "px-4 py-2 text-lg",
    className,
  );

  if ("to" in props)
    return (
      <Link
        ref={ref as Ref<HTMLAnchorElement>}
        className={className}
        arrow={false}
        {...props}
      >
        {children}
      </Link>
    );
  else
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={className}
        {...props}
      >
        {children}
      </button>
    );
}
