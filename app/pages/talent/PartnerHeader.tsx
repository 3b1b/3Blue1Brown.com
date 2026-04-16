import { href } from "react-router";
import { ArrowLeftIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import Link from "~/components/Link";
import Logo from "~/components/Logo";
import StrokeType from "~/components/StrokeType";

// top of partner page
export default function PartnerHeader() {
  return (
    <header className="dark isolate flex items-center justify-between gap-8 overflow-clip bg-white p-8 text-center text-black max-md:flex-col max-md:gap-2">
      <div className="flex flex-1 justify-start">
        <Button to={href("/")} size="sm" aria-label="Home">
          <Logo className="size-12" />
        </Button>
      </div>

      <div>
        <Link
          to={href("/talent")}
          className="flex-1 text-3xl text-black no-underline"
        >
          <StrokeType>3b1b Talent</StrokeType>
        </Link>
      </div>

      <div className="flex flex-1 justify-end">
        <Button to={href("/talent")}>
          <ArrowLeftIcon />
          More 3b1b Partners
        </Button>
      </div>
    </header>
  );
}
