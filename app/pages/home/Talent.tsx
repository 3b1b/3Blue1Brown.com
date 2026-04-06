import { href } from "react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { H2 } from "~/components/Heading";
import TriangleGrid from "~/components/TriangleGrid";

export default function Talent() {
  return (
    <section className="dark items-center width-sm">
      <TriangleGrid className="mask-radial-from-transparent mask-radial-from-0% mask-radial-to-white mask-radial-to-100%" />

      <H2>3b1b Talent</H2>

      <p>
        Think of it like a <strong>virtual career fair!</strong> We partner with
        organizations interested in hiring the kinds of technically curious
        people who watch 3Blue1Brown.
      </p>

      <Button to={href("/talent")} color="critical">
        Explore Opportunities
        <ArrowRightIcon />
      </Button>
    </section>
  );
}
