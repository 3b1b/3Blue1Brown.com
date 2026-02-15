import { ArrowRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import TriangleGrid from "~/components/TriangleGrid";

export default function Talent() {
  return (
    <section className="dark items-center">
      <TriangleGrid />

      <Heading level={2} className="self-center">
        3b1b Talent
      </Heading>

      <p className="max-w-100">
        Think of it like a <strong>virtual career fair!</strong> We partner with
        organizations interested in hiring the kinds of technically curious
        people who watch 3Blue1Brown.
      </p>

      <Button to="/talent" color="accent">
        Explore Opportunities
        <ArrowRightIcon />
      </Button>
    </section>
  );
}
