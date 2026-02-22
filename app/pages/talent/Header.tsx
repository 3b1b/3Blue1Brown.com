import { href } from "react-router";
import Button from "~/components/Button";
import DarkMode from "~/components/DarkMode";
import Logo from "~/components/Logo";
import StrokeType from "~/components/StrokeType";
import TriangleGrid from "~/components/TriangleGrid";

export default function Header() {
  return (
    <header className="dark relative isolate flex flex-col items-center gap-8 overflow-hidden bg-white px-8 py-30 text-black">
      <TriangleGrid />

      <Button
        to={href("/")}
        size="sm"
        className="absolute top-4 left-4"
        aria-label="Home"
      >
        <Logo className="size-12" />
      </Button>

      <DarkMode className="absolute top-4 right-4" />

      <hgroup className="contents">
        <h1 className="text-4xl font-medium">
          <StrokeType>3b1b Talent</StrokeType>
        </h1>
        <div className="text-xl">
          Connecting curious minds with exceptional teams
        </div>
      </hgroup>
    </header>
  );
}
