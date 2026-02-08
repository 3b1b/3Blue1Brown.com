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
  const _class = clsx(
    `
      inline-flex items-center justify-center gap-2 rounded-full font-sans
      leading-none no-underline
    `,
    color === "none" &&
      `
        text-black
        hover:bg-off-white hover:text-theme
      `,
    color === "light" &&
      `
        bg-theme/10 text-black
        hover:bg-light-gray
      `,
    color === "theme" &&
      `
        bg-theme text-white
        hover:bg-gray
      `,
    color === "accent" &&
      `
        bg-black text-white
        hover:bg-dark-gray
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
        className={_class}
        arrow={false}
        {...props}
      >
        {children}
      </Link>
    );
  else
    return (
      <button ref={ref as Ref<HTMLButtonElement>} className={_class} {...props}>
        {children}
      </button>
    );
}
