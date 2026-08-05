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
        Think of this as a <strong>virtual career fair</strong>. These
        organizations are interested in hiring the kinds of technically curious
        people who watch 3Blue1Brown. On the pages below, you'll find interviews
        between Grant and the teams, technical challenges specifically for this
        audience, and featured work we believe you'll enjoy.
      </p>

      <PiCreature
        emotion="well"
        size="md"
        className="absolute bottom-10 left-32 max-xl:hidden"
      />
    </section>
  );
}
