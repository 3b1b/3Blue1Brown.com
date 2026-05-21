import type { ComponentPropsWithRef, ReactNode, Ref } from "react";
import { Children, cloneElement, isValidElement } from "react";
import { getElementName } from "react-children-utilities";
import clsx from "clsx";
import Link from "~/components/Link";
import { getVariants } from "~/util/misc";

type Props = Base & (_Link | _Button);

type Base = {
  // color style
  color?: "none" | "light" | "theme" | "critical";
  // size
  size?: "sm" | "md";
};

type _Link = Omit<ComponentPropsWithRef<typeof Link>, "onClick">;

type _Button = ComponentPropsWithRef<"button">;

// looks like a button and either goes somewhere (link) or does something (button)
export default function Button({
  ref,
  color = "none",
  size = "md",
  className,
  children,
  ...props
}: Props) {
  children = wrapText(children);

  className = clsx(
    "inline-flex max-w-full items-center justify-center gap-2 rounded-md font-sans text-balance no-underline [&_p]:contents [&_p]:leading-normal",
    color === "none" && "text-black hocus:bg-theme/15 hocus:text-theme",
    color === "light" &&
      "bg-theme/15 text-black hocus:bg-theme hocus:text-white",
    color === "theme" &&
      "bg-theme text-white hocus-ring hocus:bg-black hocus:outline-black",
    color === "critical" &&
      "bg-black text-white hocus-ring hocus:bg-theme hocus:outline-theme",
    size === "sm" && "p-2",
    size === "md" && "min-h-12 min-w-12 p-3 text-lg",
    className,
  );

  // link
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
  // button
  else {
    const { type = "button", onClick, ...rest } = props;
    return (
      <button
        ref={ref as Ref<HTMLButtonElement>}
        className={className}
        type={type}
        onClick={(event) => {
          // prevent click action when disabled
          if (!rest["aria-disabled"]) onClick?.(event);
        }}
        {...rest}
      >
        {children}
      </button>
    );
  }
}

// for testbed page
export function Demo({ children }: { children: ReactNode }) {
  const variants = getVariants({
    color: ["none", "light", "theme", "critical"] as const,
    size: ["sm", "md"] as const,
  });

  return (
    <div className="grid grid-cols-2 place-items-center gap-4 max-md:grid-cols-1">
      {variants.map((props, index) => (
        <Button key={index} {...props}>
          {children}
        </Button>
      ))}
    </div>
  );
}

// wrap text children in spans to allow text box trimming
const wrapText = (children: ReactNode): ReactNode =>
  Children.map(children, (child) => {
    // if react element with children, recurse
    if (
      // assume that children prop will always be valid ReactNode
      isValidElement<{ children?: ReactNode }>(child) &&
      // if fragment or custom component, recurse. if native tag, break.
      !getElementName(child)
    )
      return cloneElement(child, {}, wrapText(child.props.children));
    // if primitive and has content, wrap
    if (
      (typeof child === "string" || typeof child === "number") &&
      String(child).trim()
    )
      return <span className="trim">{child}</span>;
    return child;
  });
