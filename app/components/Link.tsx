import type { ComponentProps, ReactNode } from "react";
import {
  Link as RouterLink,
  useLocation,
  useMatch,
  useResolvedPath,
} from "react-router";
import { ArrowSquareOutIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { removeParagraph } from "~/components/Markdownify";

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
  newTab,
  arrow,
  className,
  children,
  ...props
}: Props) {
  children = removeParagraph(children);

  // whether link is external (some other site) or internal (within router)
  const external = typeof to === "string" && to.match(/^(http|mailto)/);

  // whether to open link in new tab
  newTab ??= !!external;
  const target = newTab ? "_blank" : "";

  // whether to show arrow icon
  // https://dequeuniversity.com/checklists/web/links
  // https://designsystem.digital.gov/components/link
  arrow ??= !!newTab;

  // current location
  const from = useLocation();

  // destination location, as full path object
  const resolved = useResolvedPath(to);

  // are we already on target page
  const active = useMatch(to.toString()) && !external;

  // add arrow
  children = (
    <>
      {children}
      {arrow && (
        <>
          <ArrowSquareOutIcon className="mb-1 ml-0.5 icon" />
        </>
      )}
    </>
  );

  // external link
  if (external)
    return (
      <a ref={ref} href={to} target={target} className={className} {...props}>
        {children}
      </a>
    );

  // internal link, active
  if (active || !to)
    return (
      <span
        aria-current="page"
        className={clsx("pointer-events-none", className)}
      >
        {children}
      </span>
    );

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
    </RouterLink>
  );
}
