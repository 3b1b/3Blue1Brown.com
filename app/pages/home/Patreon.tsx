import { ArrowRightIcon, PatreonLogoIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";

export default function Patreon() {
  return (
    <section className="items-center bg-theme/10">
      <h2>
        <PatreonLogoIcon />
        Patreon
      </h2>

      <div className="grid w-full grid-cols-2 items-start justify-center justify-items-center gap-x-12 gap-y-4 max-md:grid-cols-1">
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

      <Button to="https://www.patreon.com/c/3blue1brown" color="theme">
        Become a Supporter
        <ArrowRightIcon />
      </Button>
    </section>
  );
}
