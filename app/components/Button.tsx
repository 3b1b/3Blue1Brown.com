import type { ComponentProps, Ref } from "react";
import clsx from "clsx";
import Link from "~/components/Link";

type Props = Base & (_Link | _Button);

type Base = {
  color?: "none" | "light" | "theme" | "accent";
  size?: "small" | "medium" | "large";
};

type _Link = { ref?: Ref<HTMLAnchorElement> } & ComponentProps<typeof Link>;

type _Button = {
  ref?: Ref<HTMLButtonElement>;
} & ComponentProps<"button">;

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
    `
      inline-flex items-center justify-center gap-2 rounded-full font-sans
      leading-none no-underline
    `,
    color === "none" &&
      `
        text-black
        hover:bg-theme/10 hover:text-theme
      `,
    color === "light" &&
      `
        bg-theme/10 text-black
        hover:bg-theme hover:text-white
      `,
    color === "theme" &&
      `
        bg-theme text-white outline-offset-2 outline-black
        hover:bg-black hover:outline-2
      `,
    color === "accent" &&
      `
        bg-black text-white outline-offset-2 outline-theme
        hover:bg-theme hover:outline-2
      `,
    size === "small" && "p-2",
    size === "medium" && "p-4 text-lg",
    size === "large" && "p-6 text-xl",
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
