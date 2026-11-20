import { href } from "react-router";
import { ArrowRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { H2 } from "~/components/Heading";
import { Platforms } from "~/pages/extras/Podcast";
import { logo } from "~/pages/podcast/podcast";

// home page podcast section
export default function Podcast() {
  return (
    <section className="bg-alt-white">
      <H2>
        <hr />
        Podcast
        <hr />
      </H2>

      <div className="grid w-full grid-cols-2 items-center justify-center justify-items-center gap-x-12 gap-y-8 max-md:grid-cols-1">
        <img src={logo} alt="The 3Blue1Brown Podcast" className="max-w-50" />

        <div className="flex flex-col gap-8 self-center">
          <p className="text-center text-balance">
            Conversations about mathematics.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Platforms />
          </div>
          <Button to={`${href("/extras")}#podcast`} color="light">
            Episodes
            <ArrowRightIcon />
          </Button>
        </div>
      </div>
    </section>
  );
}
