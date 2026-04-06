import { H1 } from "~/components/Heading";
import StrokeType from "~/components/StrokeType";

// partner gallery page header
export default function Header() {
  return (
    <hgroup className="mb-8 flex flex-col gap-2">
      <H1 className="font-serif text-5xl">
        <StrokeType>3b1b Talent</StrokeType>
      </H1>
      <div className="text-center font-sans text-xl text-balance">
        Connecting curious minds with exceptional teams
      </div>
    </hgroup>
  );
}
