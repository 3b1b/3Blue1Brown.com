import { ArrowRightIcon, CirclesThreePlusIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import SectionFlare from "~/components/SectionFlare";

export default function Extras() {
  return (
    <section className="items-center">
      <SectionFlare className="text-gray" />

      <Heading level={2}>
        <CirclesThreePlusIcon />
        Extras
      </Heading>

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
