import clsx from "clsx";
import PiCreature from "~/components/PiCreature";

// id of this section, so the header's toggle can reference it
export const introId = "talent-intro";

type Props = {
  // whether to hide the section (stays mounted, so the toggle can reference it)
  hidden?: boolean;
};

// partner gallery page introduction section
export default function Intro({ hidden }: Props) {
  return (
    <section
      id={introId}
      // not the hidden attribute, which the base section styles would override
      className={clsx("bg-theme/15", hidden && "hidden")}
    >
      <p>
        These organizations are partners with 3blue1brown seeking to hire
        technically curious people like you. If this channel were a university,
        think of this as the campus career fair where you can find aligned
        opportunities. Explore the pages below to learn what makes each team
        unique.
      </p>
      <PiCreature
        emotion="well"
        size="md"
        className="absolute bottom-10 left-32 max-xl:hidden"
      />
    </section>
  );
}
