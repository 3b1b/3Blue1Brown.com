import type { ReactNode } from "react";
import { useState } from "react";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Grid from "~/components/Grid";
import HomeLink from "~/components/HomeLink";
import Nav from "~/components/Nav";
import site from "~/data/site.yaml";

type Props = {
  children?: ReactNode;
};

export default function Header({ children }: Props) {
  const [open, setOpen] = useState(false);

  const className = `
    border-b border-transparent p-2 leading-none text-black no-underline
    transition
    hover:border-black
  `;

  return (
    <header
      className="
        dark flex flex-col bg-white
        *:bg-transparent
      "
    >
      <Grid className="mask-b-from-0% mask-b-to-100% opacity-25" />

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
