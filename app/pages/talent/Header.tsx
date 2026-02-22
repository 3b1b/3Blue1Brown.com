import { href } from "react-router";
import Link from "~/components/Link";
import Logo from "~/components/Logo";
import StrokeType from "~/components/StrokeType";
import TriangleGrid from "~/components/TriangleGrid";

export default function Header() {
  return (
    <header className="dark relative isolate flex flex-col items-center gap-8 overflow-hidden bg-white px-8 py-20 text-black">
      <TriangleGrid />

      <Link to={href("/")} className="absolute top-4 left-4 no-underline">
        <Logo className="size-12" />
      </Link>

      <hgroup className="contents">
        <h1>
          <StrokeType>3b1b Talent</StrokeType>
        </h1>
        <div className="text-xl">
          Connecting curious minds with exceptional teams
        </div>
      </hgroup>
    </header>
  );
}
