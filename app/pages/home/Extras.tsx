import { href } from "react-router";
import { ArrowRightIcon, CirclesThreePlusIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";

export default function Extras() {
  return (
    <section className="items-center">
      <h2>
        <CirclesThreePlusIcon />
        Extras
      </h2>

      <p className="max-w-100 self-center">
        Resources, podcasts, blog, collabs, courses, conversations, and other
        miscellany that don't fit elsewhere on the site.
      </p>

      <Button to={href("/extras")} color="theme">
        Go on a Tangent
        <ArrowRightIcon />
      </Button>
    </section>
  );
}
