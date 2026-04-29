import { ArrowRightIcon, PatreonLogoIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { H2 } from "~/components/Heading";
import Image from "~/components/Image";
import site from "~/data/site.json";
import support from "./images/support.png";

// home page patreon section
export default function Patreon() {
  return (
    <section className="items-center bg-theme/15">
      <H2>
        <hr />
        <PatreonLogoIcon />
        Patreon
        <hr />
      </H2>

      <div className="grid w-full grid-cols-2 items-center justify-center justify-items-center gap-x-12 gap-y-8 max-md:grid-cols-1">
        <p>
          If these lessons bring you value comparable to that of a textbook or a
          course, it would mean a lot to me and the rest of the team if you
          considered joining as a supporter.
        </p>
        <p>
          Supporters get early access to new videos and provide essential
          feedback to refine their final form. Other perks include a meaningful
          store discount and having your name in a video.
        </p>

        <Image image={support} alt="" className="w-50" />

        <div className="flex flex-col items-center gap-3 self-center">
          <Button to={site.socials.patreon} color="theme">
            Become a Supporter
            <ArrowRightIcon />
          </Button>
          <Button
            to="https://members.3blue1brown.com/posts/solution-to-sum-156593740"
            color="light"
          >
            New video (early access)
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}
