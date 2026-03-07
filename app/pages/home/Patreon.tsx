import { ArrowRightIcon, PatreonLogoIcon } from "@phosphor-icons/react";
// import previewVideo from "~/assets/clips/clacks.mp4";
import Button from "~/components/Button";
import { H2 } from "~/components/Heading";
import Image from "~/components/Image";
import site from "~/data/site.json";
import support from "./images/support.png";

export default function Patreon() {
  return (
    <section className="items-center bg-theme/10">
      <H2>
        <hr />
        <PatreonLogoIcon />
        Patreon
        <hr />
      </H2>

      <div className="grid w-full grid-cols-2 items-center justify-center justify-items-center gap-x-12 gap-y-8 max-md:grid-cols-1">
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

        <Image image={support} alt="" className="w-50" />

        <Button to={site.socials.patreon} color="theme" className="self-center">
          Become a Supporter
          <ArrowRightIcon />
        </Button>

        {/* <p className="text-center text-balance">
          A sneak peek at the next lesson, available to patrons...
        </p>

        <video
          src={previewVideo}
          className="aspect-video w-100"
          controls
          autoPlay
          muted
          loop
        /> */}
      </div>
    </section>
  );
}
