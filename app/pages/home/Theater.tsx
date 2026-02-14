import {
  BookOpenTextIcon,
  InfoIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";
import Button from "~/components/Button";
import Heading from "~/components/Heading";

export default function Theater() {
  return (
    <section className="wide">
      <Heading level={1} className="sr-only">
        Home
      </Heading>
      <Heading level={2} className="sr-only">
        Theater
      </Heading>
      <div className="flex flex-col gap-2">
        <div className="flex gap-2">
          <div
            className="
              grid flex-1 grid-rows-3 gap-2
              *:aspect-video *:bg-off-white
              max-lg:hidden
            "
          >
            <div />
            <div />
            <div />
          </div>
          <div className="aspect-video flex-3 bg-light-gray" />
          <div
            className="
              grid flex-1 grid-rows-3 gap-2
              *:aspect-video *:bg-off-white
              max-lg:hidden
            "
          >
            <div />
            <div />
            <div />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <div>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</div>
          <Button size="small">
            <ShareNetworkIcon />
            Share
          </Button>
          <Button size="small">
            <InfoIcon />
            Details
          </Button>
          <Button size="small">
            <BookOpenTextIcon />
            Read
          </Button>
        </div>
      </div>
    </section>
  );
}
