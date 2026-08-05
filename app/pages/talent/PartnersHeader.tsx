import { CaretDownIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import { H1 } from "~/components/Heading";
import StrokeType from "~/components/StrokeType";
import { introId } from "./Intro";

type Props = {
  // whether the intro section below the header is showing
  showIntro: boolean;
  // show/hide the intro section
  onToggleIntro: () => void;
};

// partner gallery page header
export default function PartnersHeader({ showIntro, onToggleIntro }: Props) {
  return (
    // toggle sits well clear of the title, and close to the section it opens
    <div className="flex flex-col gap-12 max-md:gap-8">
      <hgroup className="flex flex-col gap-4">
        <H1 className="font-serif text-5xl">
          <StrokeType>3b1b Talent</StrokeType>
        </H1>
        <div className="text-center font-sans text-2xl text-balance">
          A virtual career fair
        </div>
      </hgroup>

      <Button
        size="sm"
        onClick={onToggleIntro}
        aria-expanded={showIntro}
        aria-controls={introId}
        className="self-center text-sm text-gray"
      >
        What is this?
        <CaretDownIcon
          className={clsx("icon transition", showIntro && "rotate-180")}
        />
      </Button>
    </div>
  );
}
