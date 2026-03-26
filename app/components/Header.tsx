import type { ReactNode } from "react";
import { href, useLocation } from "react-router";
import { BellIcon, PlayIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import Grid from "~/components/Grid";
import Logo from "~/components/Logo";
import Nav from "~/components/Nav";
import StrokeType from "~/components/StrokeType";
import site from "~/data/site.json";
import stats from "~/pages/home/stats.json";
import { formatNumber } from "~/util/string";

type Props = {
  // extra content below header
  children?: ReactNode;
};

// header on every page
export default function Header({ children }: Props) {
  const { pathname } = useLocation();

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

        {/* nav */}
        <Nav />

        {/* sub title */}
        <div className="flex grow basis-0 flex-col items-end gap-2 text-right text-dark-gray max-xl:hidden">
          <div>{site.subtitle}</div>
          {pathname === "/" && (
            <div className="flex items-center gap-2 text-sm">
              <div className="flex items-center gap-1 lowercase">
                {formatNumber(stats.subscribers)}
                <BellIcon aria-label="Subscribers" />
              </div>
              <div className="flex items-center gap-1 lowercase">
                {formatNumber(stats.views)}
                <PlayIcon aria-label="Views" />
              </div>
            </div>
          )}
        </div>
      </div>

      {children}
    </header>
  );
}
