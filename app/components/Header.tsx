import { ListIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { clsx } from "clsx";
import DarkMode from "~/components/DarkMode";
import GridPlane from "~/components/GridPlane";
import Logo from "~/components/Logo";
import { site } from "~/Meta";

const links = [
  { name: "Channel", to: "https://www.youtube.com/c/3blue1brown" },
  { name: "Talent", to: "/talent" },
  { name: "Patreon", to: "https://www.patreon.com/c/3blue1brown" },
  { name: "Store", to: "https://store.dftba.com/collections/3blue1brown" },
  { name: "Extras", to: "/extras" },
  { name: "FAQ", to: "/faq" },
  { name: "About", to: "/about" },
];

type Props = {
  sticky?: boolean;
};

export default function Header({ sticky = false }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={clsx(
        `
          dark relative z-10 flex flex-wrap items-center gap-8 bg-white p-8
          font-sans text-black
          max-md:p-6
          [&_a,&_button]:text-black [&_a,&_button]:no-underline
          [&_a,&_button]:hover:text-theme
        `,
        sticky && "sticky top-0",
      )}
    >
      <GridPlane />

      <a href="/" className="flex items-center gap-4 font-serif text-lg">
        <Logo className="size-16" />
        <div className="flex flex-col">
          <div className="text-2xl">{site.title}</div>
          <div className="opacity-50">{site.subtitle}</div>
        </div>
      </a>

      <button
        className="
          ml-auto
          lg:hidden
        "
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="nav"
        aria-label={open ? "Collapse menu" : "Expand menu"}
      >
        {open ? <XIcon /> : <ListIcon />}
      </button>

      <nav
        className={clsx(
          `
            ml-auto flex flex-wrap items-center justify-center gap-6
            max-lg:w-full max-lg:flex-col max-lg:items-end
          `,
          !open && "max-lg:hidden",
        )}
      >
        {links.map(({ name, to }) => (
          <a key={to} href={to} className="flex items-center gap-1">
            {name}
          </a>
        ))}
        <DarkMode />
      </nav>
    </header>
  );
}
