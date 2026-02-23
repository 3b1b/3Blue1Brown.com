import type { ReactNode } from "react";
import { useState } from "react";
import { href } from "react-router";
import { ListIcon, XIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import Grid from "~/components/Grid";
import Logo from "~/components/Logo";
import Nav from "~/components/Nav";
import StrokeType from "~/components/StrokeType";
import site from "~/data/site.yaml";

type Props = {
  children?: ReactNode;
};

export default function Header({ children }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <header
      className={clsx(
        "dark relative isolate flex flex-col gap-8 overflow-hidden bg-white p-8 text-black max-md:gap-4 max-md:p-4",
      )}
    >
      <Grid className="max-h-200 mask-b-from-0% mask-b-to-100% opacity-25" />

      <div className="flex flex-wrap items-center gap-4">
        {/* title */}
        <div className="flex grow basis-0 items-center">
          <Button to={href("/")} size="sm" aria-label="Home">
            <Logo className="size-12" />
            <StrokeType className="ml-1 w-fit font-serif text-3xl">
              {site.title}
            </StrokeType>
          </Button>
        </div>

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

        {/* nav */}
        <Nav
          className={clsx(
            "flex-3 max-xl:justify-end max-lg:w-full max-lg:flex-[unset] max-sm:flex-col",
            !open && "max-lg:hidden",
          )}
        />

        {/* sub title */}
        <div className="grow basis-0 text-right text-gray italic max-xl:hidden">
          {site.subtitle}
        </div>
      </div>

      {children}
    </header>
  );
}
