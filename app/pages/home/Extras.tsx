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

      <div
        className="
          grid w-full grid-cols-2 items-start justify-center
          justify-items-center gap-x-12 gap-y-4
          max-md:grid-cols-1
        "
      >
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
          sapien nec ipsum efficitur efficitur. Curabitur ac ligula quis metus
          consectetur convallis. Donec a nunc ut nisl efficitur tincidunt.
        </p>

        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec vel
          sapien nec ipsum efficitur efficitur. Curabitur ac ligula quis metus
          consectetur convallis. Donec a nunc ut nisl efficitur tincidunt.
        </p>
      </div>

      <Button to="/extras" color="accent">
        Go on a Tangent
        <ArrowRightIcon />
      </Button>
    </section>
  );
}
