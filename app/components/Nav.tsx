import { useState } from "react";
import { href } from "react-router";
import { ListIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import Tooltip from "~/components/Tooltip";
import site from "~/data/site.json";
import { Search } from "~/pages/home/Explore";

// site navigation links
const links = [
  {
    name: "Channel",
    to: site.socials.channel,
  },
  {
    name: "Talent",
    to: href("/talent"),
  },
  {
    name: "Patreon",
    to: site.socials.patreon,
  },
  {
    name: "Store",
    to: site.socials.store,
  },
  {
    name: "Extras",
    to: href("/extras"),
  },
  {
    name: "About",
    to: href("/about"),
  },
];

// main site navigation
export default function Nav() {
  // expand/collapse state (for smaller/mobile views)
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* toggle */}
      <Button
        className="lg:hidden"
        size="sm"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        aria-controls="nav"
        aria-label={open ? "Collapse menu" : "Expand menu"}
      >
        {open ? <XIcon /> : <ListIcon />}
      </Button>

      <nav
        id="nav"
        className={clsx(
          "flex flex-2 flex-wrap items-center justify-center gap-4 font-sans text-lg max-xl:justify-end max-lg:w-full max-lg:flex-[unset] max-sm:flex-col",
          !open && "max-lg:hidden",
        )}
      >
        {/* search */}
        <Tooltip
          trigger={
            <Button aria-label="Lesson search" size="sm">
              <MagnifyingGlassIcon />
            </Button>
          }
          click
          className="@container w-200! gap-8 overflow-x-hidden"
        >
          <Search />
        </Tooltip>

        {links.map(({ name, to }, index) => (
          <Button
            key={index}
            to={to}
            arrow={false}
            size="sm"
            className={index === 0 ? "border" : undefined}
          >
            {name}
          </Button>
        ))}
      </nav>
    </>
  );
}
