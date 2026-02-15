import type { ComponentProps, ReactNode } from "react";
import { Link as RouterLink, useLocation, useResolvedPath } from "react-router";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { mergeTo } from "~/util/url";

type Props = Base & (_Anchor | _Router);

type Base = {
  // force link opening in new/same tab
  newTab?: boolean;
  // force showing/hiding arrow icon
  arrow?: boolean;
  // class on link
  className?: string;
  // content
  children: ReactNode;
};

type _Anchor = ComponentProps<"a"> & { to: string };
type _Router = ComponentProps<typeof RouterLink>;

// link to internal route or external url
export default function Link({
  ref,
  to,
  children,
  newTab,
  arrow,
  className,
  ...props
}: Props) {
  // whether link is external (some other site) or internal (within router)
  const external = typeof to === "string" && to.match(/^(http|mailto)/);

  // whether to open link in new tab
  const target = (newTab ?? external) ? "_blank" : "";

  // whether to show arrow icon
  arrow ??= !!target;

  // class name string
  className = clsx("inline-flex items-center gap-1", className);

  // current location
  const from = useLocation();

  // destination location, as full path object
  const resolved = useResolvedPath(to);

  // are we already on target page
  const active =
    !external && (from.pathname === to || from.pathname === resolved.pathname);

  // external link
  if (external)
    return (
      <a ref={ref} href={to} target={target} className={className} {...props}>
        {children}
        {arrow && <ArrowSquareOutIcon />}
      </a>
    );

  // internal link, active
  if (active)
    return (
      <span className={clsx("pointer-events-none", className)} data-active>
        {children}
      </span>
    );

  // other internal link
  return (
    <RouterLink
      ref={ref}
      to={mergeTo(from, to)}
      target={target}
      className={className}
      {...props}
      viewTransition={resolved.pathname !== from.pathname ? true : undefined}
    >
      {children}
      {arrow && <ArrowSquareOutIcon />}
    </RouterLink>
  );
}
