import { href } from "react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { H2 } from "~/components/Heading";
import Link from "~/components/Link";
import { logo, platforms } from "~/pages/podcast/podcast";

// home page podcast section
export default function Podcast() {
  return (
    <section className="items-center bg-alt-white">
      <H2>
        <hr />
        Podcast
        <hr />
      </H2>

      <p>
        Conversations about mathematics, AI, and the future of human
        understanding.
      </p>

      <img src={logo} alt="The 3Blue1Brown Podcast" className="w-75" />

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

      <Button to={href("/extras")} color="light">
        All Episodes
        <ArrowRightIcon />
      </Button>
    </section>
  );
}
