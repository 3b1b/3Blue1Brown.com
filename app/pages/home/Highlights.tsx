import {
  ArrowRightIcon,
  CirclesThreePlusIcon,
  HandshakeIcon,
  PatreonLogoIcon,
} from "@phosphor-icons/react";
import Button from "~/components/Button";
import Heading from "~/components/Heading";

export default function Highlights() {
  return (
    <section>
      <Heading level={2} className="sr-only">
        Highlights
      </Heading>
      <Patreon />
      <Talent />
      <Extras />
    </section>
  );
}

function Patreon() {
  return (
    <div className="relative flex flex-col items-center gap-8 p-8">
      <div
        className="
          absolute inset-y-0 -right-8 -left-200 -z-10 skew-x-15 bg-theme/15
        "
      />

      <Heading level={3} className="justify-center">
        <PatreonLogoIcon />
        Patreon
      </Heading>

      <div
        className="
          grid w-full grid-cols-2 items-start justify-center
          justify-items-center gap-x-12 gap-y-4
          max-md:grid-cols-1
        "
      >
        <p>
          Textbooks and courses are often expensive. I believe educational
          content is <em>most valuable when it's free</em>. Instead of up-front
          fees or ads, this channel is{" "}
          <strong>supported directly by viewers</strong> through Patreon. This
          helps the channel stay accessible and without distraction.
        </p>

        <p>
          Patrons get early access to new videos and provide essential feedback
          to refine their final form. Other perks include a meaningful store
          discount and having your name in a video. Viewers aren't obligated to
          become supporters, but I'm very grateful for those who do.
        </p>
      </div>

      <Button to="" color="accent">
        Become a Supporter
        <ArrowRightIcon />
      </Button>
    </div>
  );
}

function Talent() {
  return (
    <div className="relative flex flex-col items-center gap-8 p-8">
      <div
        className="
          absolute inset-y-0 -right-200 -left-8 -z-10 skew-x-15 bg-secondary/15
        "
      />

      <Heading level={3} className="justify-center">
        <HandshakeIcon />
        3b1b Talent
      </Heading>

      <p className="max-w-100">
        Think of it like a <strong>virtual career fair!</strong> We partner with
        organizations interested in hiring the kinds of technically curious
        people who watch 3Blue1Brown.
      </p>

      <Button to="" color="accent">
        Explore Opportunities
        <ArrowRightIcon />
      </Button>
    </div>
  );
}

function Extras() {
  return (
    <div className="relative flex flex-col items-center gap-8 p-8">
      <div
        className="
          absolute inset-y-0 -right-8 -left-200 -z-10 skew-x-15 bg-gray/15
        "
      />

      <Heading level={3} className="justify-center">
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

      <Button to="" color="accent">
        Go on a Tangent
        <ArrowRightIcon />
      </Button>
    </div>
  );
}
