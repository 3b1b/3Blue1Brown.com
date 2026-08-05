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
    <div className="mb-8 flex flex-col gap-2">
      <hgroup className="flex flex-col gap-2">
        <H1 className="font-serif text-5xl">
          <StrokeType>3b1b Talent</StrokeType>
        </H1>
        <div className="text-center font-sans text-xl text-balance">
          Connecting curious minds with exceptional teams
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
