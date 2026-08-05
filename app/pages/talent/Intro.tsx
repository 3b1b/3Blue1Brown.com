import clsx from "clsx";
import PiCreature from "~/components/PiCreature";

// id of this section, so the header's toggle can reference it
export const introId = "talent-intro";

type Props = {
  // hide the section, but keep it mounted for the header's toggle to reference
  hidden?: boolean;
};

// partner gallery page introduction section
export default function Intro({ hidden }: Props) {
  return (
    <section id={introId} className={clsx("bg-theme/15", hidden && "hidden")}>
      <p>
        These organizations are partners with 3Blue1Brown seeking to hire
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
