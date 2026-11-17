import { href } from "react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import Card from "~/components/Card";
import { H2 } from "~/components/Heading";
import Link from "~/components/Link";
import { getThumbnail, getWatch } from "~/components/YouTube";
import { episodes, logo, platforms } from "~/pages/podcast/podcast";

// most recent episode
const [latest] = episodes;

// home page podcast section
export default function Podcast() {
  return (
    <section className="items-center bg-alt-white">
      <H2>
        <hr />
        Podcast
        <hr />
      </H2>

      <img src={logo} alt="The 3Blue1Brown Podcast" className="w-50" />

      <div className="flex flex-wrap items-center justify-center gap-4 *:size-8">
        {platforms.map(({ name, link, image }) => (
          <Link
            to={link}
            key={name}
            arrow={false}
            className="transition hocus:grayscale"
            title={`Listen via ${name}`}
            aria-label={`Listen via ${name}`}
          >
            <img src={image} alt="" />
          </Link>
        ))}
      </div>

      {latest && (
        <Card
          direction="row"
          to={getWatch(latest.video)}
          image={getThumbnail(latest.video)}
          title={latest.title}
          description={latest.description}
          className="w-full"
        />
      )}

      <Button to={href("/extras")} color="light">
        More Episodes
        <ArrowRightIcon />
      </Button>
    </section>
  );
}
