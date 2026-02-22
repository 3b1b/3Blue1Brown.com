import { href } from "react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import TriangleGrid from "~/components/TriangleGrid";

export default function Talent() {
  return (
    <section className="dark items-center width-xs">
      <TriangleGrid />

      <h2>3b1b Talent</h2>

      <p>
        Think of it like a <strong>virtual career fair!</strong> We partner with
        organizations interested in hiring the kinds of technically curious
        people who watch 3Blue1Brown.
      </p>

      <Button to={href("/talent")} color="accent">
        Explore Opportunities
        <ArrowRightIcon />
      </Button>
    </section>
  );
}
