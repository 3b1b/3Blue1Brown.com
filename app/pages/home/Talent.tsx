import { href } from "react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { H1 } from "~/components/Heading";
import Marquee from "~/components/Marquee";
import TriangleGrid from "~/components/TriangleGrid";
import { partners } from "~/pages/talent/Gallery";
import {
  getPartner,
  getWordmark,
  getWordmarkDark,
} from "~/pages/talent/Partner";

export default function Talent() {
  return (
    <section className="dark items-center width-sm">
      <TriangleGrid className="vignette" />

      <H1>3b1b Talent</H1>

      <p>
        Think of it as a <strong>virtual career fair.</strong> We partner with
        organizations interested in hiring the kinds of technically curious
        people who watch 3Blue1Brown.
      </p>

      <Button to={href("/talent")} color="critical">
        Explore Opportunities
        <ArrowRightIcon />
      </Button>

      <Marquee className="z-100 mt-8 w-screen self-center opacity-50 brightness-200 grayscale">
        {partners.map((id) => {
          const wordmark = getWordmarkDark(id) ?? getWordmark(id);
          const name = getPartner(id)?.frontmatter.name ?? id;
          return wordmark ? (
            <img
              key={id}
              src={wordmark}
              alt={name}
              className="h-10 w-auto object-contain"
            />
          ) : (
            <span key={id} className="font-sans text-lg font-medium">
              {name}
            </span>
          );
        })}
      </Marquee>
    </section>
  );
}
