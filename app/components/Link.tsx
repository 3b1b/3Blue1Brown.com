import type { ComponentProps, ReactNode } from "react";
import {
  Link as RouterLink,
  useLocation,
  useMatch,
  useResolvedPath,
} from "react-router";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";

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

  // current location
  const from = useLocation();

  // destination location, as full path object
  const resolved = useResolvedPath(to);

  // are we already on target page
  const active = useMatch(to.toString()) && !external;

  // external link
  if (external)
    return (
      <a ref={ref} href={to} target={target} className={className} {...props}>
        {children}
        {arrow && <ArrowSquareOutIcon />}
      </a>
    );

  // internal link, active
  if (active || !to) return <span className={className}>{children}</span>;

  // other internal link
  return (
    <RouterLink
      ref={ref}
      to={to}
      target={target}
      className={className}
      viewTransition={resolved.pathname !== from.pathname ? true : undefined}
      {...props}
    >
      {children}
      {arrow && <ArrowSquareOutIcon />}
    </RouterLink>
  );
}
