import { QuestionIcon } from "@phosphor-icons/react";
import { H1 } from "~/components/Heading";
import Link from "~/components/Link";
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
        <Link to="#what-is-this" className="flex">
          <QuestionIcon />
        </Link>
      </div>
    </hgroup>
  );
}
