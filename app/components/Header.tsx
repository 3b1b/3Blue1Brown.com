import { ListIcon, XIcon } from "@phosphor-icons/react";
import type { ReactNode } from "react";
import { useState } from "react";
import { clsx } from "clsx";
import GridPlane from "~/components/GridPlane";
import HomeLink from "~/components/HomeLink";
import Nav from "~/components/Nav";
import { site } from "~/Meta";

type Props = {
  children?: ReactNode;
};

export default function Header({ children }: Props) {
  const [open, setOpen] = useState(false);

  /** button/link class */
  const className = `
    border-b border-transparent p-2 leading-none text-black no-underline
    transition
    hover:border-black
  `;

  return (
    <header
      className="
        dark relative isolate flex flex-col overflow-hidden bg-white
        *:bg-transparent
      "
    >
      <GridPlane />

      <div className="flex flex-wrap items-center">
        {/* title */}
        <HomeLink className="flex-1" childClassName={className} />

        {/* toggle */}
        <button
          className={clsx("lg:hidden", className)}
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="nav"
          aria-label={open ? "Collapse menu" : "Expand menu"}
        >
          {open ? <XIcon /> : <ListIcon />}
        </button>

        {/* nav */}
        <Nav
          className={clsx(
            `
              flex-3
              max-xl:justify-end
              max-lg:w-full max-lg:flex-[unset]
            `,
            !open && "max-lg:hidden",
          )}
          childClassName={className}
        />

        {/* sub title */}
        <div
          className="
            flex-1 text-right text-gray italic
            max-xl:hidden
          "
        >
          {site.subtitle}
        </div>
      </div>

      {children}
    </header>
  );
}
