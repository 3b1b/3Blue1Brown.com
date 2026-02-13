import { ArrowRightIcon, PatreonLogoIcon } from "@phosphor-icons/react";
import { useRef } from "react";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import { useScroll } from "~/util/hooks";

export default function Patreon() {
  const ref = useRef<HTMLDivElement>(null);
  const percent = useScroll(ref);

  return (
    <section className="items-center">
      <div
        ref={ref}
        className="absolute inset-0 -z-10 -skew-x-15 bg-theme/15"
        style={{ translate: `${percent * 10}% 0` }}
      />

      <Heading level={2}>
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
    </section>
  );
}
