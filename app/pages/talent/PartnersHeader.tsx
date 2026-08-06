import { H1 } from "~/components/Heading";
import Help from "~/components/Help";
import StrokeType from "~/components/StrokeType";

// partner gallery page header
export default function PartnersHeader() {
  return (
    <hgroup className="mb-8 flex flex-col gap-4">
      <H1 className="font-serif text-5xl">
        <StrokeType>3b1b Talent</StrokeType>
      </H1>
      <div className="flex items-center justify-center gap-2 text-center font-sans text-xl text-balance">
        A virtual career fair
        <Help>
          These organizations are partners with 3Blue1Brown seeking to hire
          technically curious people like you. If this channel were a
          university, think of this as the campus career fair where you can find
          aligned opportunities. Explore the pages below to learn what makes
          each team unique.
        </Help>
      </div>
    </hgroup>
  );
}
