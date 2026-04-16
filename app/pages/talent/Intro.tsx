import PiCreature from "~/components/PiCreature";

// partner gallery page introduction section
export default function Intro() {
  return (
    <section className="bg-theme/15">
      <p>
        Think of this as a <strong>virtual career fair</strong>. These
        organizations are interested in hiring the kinds of technically curious
        people who watch 3Blue1Brown. On the pages below, you'll find interviews
        between Grant and the teams, technical challenges specifically for this
        audience, and featured work we believe you'll enjoy.
      </p>

      <PiCreature
        emotion="hooray"
        size="sm"
        className="absolute left-10 self-center max-xl:hidden"
      >
        It's a virtual career fair!
      </PiCreature>
    </section>
  );
}
