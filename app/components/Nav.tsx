import type { Ref } from "react";
import { useRef } from "react";
import { createPortal } from "react-dom";
import { href, useLocation } from "react-router";
import { ListIcon, MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react";
import { useEventListener } from "@reactuses/core";
import clsx from "clsx";
import { atom, useAtom } from "jotai";
import Button from "~/components/Button";
import DarkMode from "~/components/DarkMode";
import Dialog from "~/components/Dialog";
import site from "~/data/site.json";
import { Search } from "~/pages/home/Lessons";
import { useChanged, useClient } from "~/util/hooks";
import { sleep } from "~/util/misc";

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

// expand/collapse state (for smaller/mobile views)
const openAtom = atom(false);

// main site navigation
export default function Nav() {
  const ref = useRef<HTMLDivElement>(null);

  // open state
  const [open, setOpen] = useAtom(openAtom);

  // client vs ssr
  const client = useClient();

  // close
  useEventListener("keydown", (event) => {
    if (event.key === "Escape" && open) setOpen(false);
  });

  // close on route change
  if (useChanged(useLocation().pathname)) sleep().then(() => setOpen(false));

  return (
    <>
      {/* desktop */}
      <Links className="max-xl:justify-end max-lg:hidden" />
      {/* mobile */}
      <>
        {/* toggle */}
        <Toggle />
        {client &&
          createPortal(
            <div
              className={clsx(
                "dark fixed inset-0 z-20 flex justify-end transition lg:hidden print:hidden",
                open
                  ? "pointer-events-auto bg-black/25"
                  : "pointer-events-none bg-transparent",
              )}
              onClick={(event) => {
                // close if clicked backdrop directly (not a nav link)
                if (event.target === event.currentTarget) setOpen(false);
              }}
            >
              <Links
                ref={ref}
                className={clsx(
                  "flex flex-col justify-start overflow-y-auto bg-white p-8 text-right transition lg:hidden",
                  open ? "translate-x-0" : "translate-x-full",
                )}
              />
            </div>,
            document.body,
          )}
      </>
    </>
  );
}

function Toggle() {
  const [open, setOpen] = useAtom(openAtom);
  return (
    <Button
      size="sm"
      className="lg:hidden"
      onClick={() => setOpen(!open)}
      aria-expanded={open}
      aria-controls={id}
      aria-label={open ? "Close menu" : "Open menu"}
    >
      {open ? <XIcon /> : <ListIcon />}
    </Button>
  );
}

type LinksProps = {
  // ref to nav element, for mobile click outside
  ref?: Ref<HTMLDivElement>;
  // class on nav element
  className?: string;
};

function Links({ ref, className = "" }: LinksProps) {
  return (
    <nav
      ref={ref}
      id={id}
      className={clsx("flex justify-center gap-4 font-sans text-lg", className)}
    >
      <Toggle />
      {/* search */}
      <Dialog
        title="Lessons"
        trigger={
          <Button size="sm" aria-label="Lesson search">
            <MagnifyingGlassIcon />
          </Button>
        }
        className="@container"
      >
        {(close) => <Search close={close} />}
      </Dialog>

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

      <DarkMode />
    </nav>
  );
}

const id = "nav";
