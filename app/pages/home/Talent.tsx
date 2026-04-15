import { href } from "react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { H1 } from "~/components/Heading";
import TriangleGrid from "~/components/TriangleGrid";

export default function Talent() {
  return (
    <section className="dark items-center width-sm">
      <TriangleGrid className="vignette" />

      <H1>3b1b Talent</H1>

      <p>
        Think of it as a <strong>virtual career fair.</strong> We partner with
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
