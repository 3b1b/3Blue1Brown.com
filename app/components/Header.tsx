import type { ReactNode } from "react";
import { href } from "react-router";
import clsx from "clsx";
import Button from "~/components/Button";
import Grid from "~/components/Grid";
import Logo from "~/components/Logo";
import Nav from "~/components/Nav";
import StrokeType from "~/components/StrokeType";
import site from "~/data/site.json";

type Props = {
  // background for header
  background?: ReactNode;
  // extra content below header
  children?: ReactNode;
};

const defaultBackground = (
  <Grid
    className={clsx("max-h-200 mask-b-from-0% mask-b-to-100% opacity-35")}
  />
);

// header on every page
export default function Header({
  background = defaultBackground,
  children,
}: Props) {
  return (
    <header
      className={clsx(
        "dark relative isolate z-20 flex flex-col gap-8 overflow-clip bg-white p-8 text-black max-md:gap-4 max-md:p-4 print:hidden",
      )}
    >
      {background}

      <div className="flex flex-wrap items-center gap-4">
        {/* title */}
        <div className="flex grow basis-0 items-center">
          <Button to={href("/")} size="sm" aria-label="Home">
            <Logo className="size-12 max-md:size-8" />
            <StrokeType className="ml-1 w-fit font-serif text-3xl max-md:text-2xl">
              {site.title}
            </StrokeType>
          </Button>
        </div>

        {/* nav */}
        <Nav />

        {/* sub title */}
        <div className="flex grow basis-0 max-xl:hidden"></div>
      </div>

      {children}
    </header>
  );
}
