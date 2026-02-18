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

      <Button to="/extras" color="accent">
        Go on a Tangent
        <ArrowRightIcon />
      </Button>
    </section>
  );
}
