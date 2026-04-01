import { href } from "react-router";
import Button from "~/components/Button";
import { H1 } from "~/components/Heading";
import Logo from "~/components/Logo";
import StrokeType from "~/components/StrokeType";
import TriangleGrid from "~/components/TriangleGrid";

// partner gallery page header
export default function Header() {
  return (
    <header className="dark relative isolate flex flex-col items-center gap-8 overflow-clip bg-white px-8 py-30 text-black">
      <TriangleGrid />

      <Button
        to={href("/")}
        size="sm"
        className="absolute top-4 left-4"
        aria-label="Home"
      >
        <Logo className="size-12" />
      </Button>

      <hgroup className="contents">
        <H1 className="text-5xl">
          <StrokeType>3b1b Talent</StrokeType>
        </H1>
        <div className="text-center font-sans text-xl text-balance">
          Connecting curious minds with exceptional teams
        </div>
      </hgroup>
    </header>
  );
}
