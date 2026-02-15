import { useEffect } from "react";
import {
  BookOpenTextIcon,
  InfoIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";
import { useAtomValue } from "jotai";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import { getLatest, getLesson } from "~/data/lessons";
import { lessonAtom } from "~/pages/home/Explore";
import { getThumbnail } from "~/util/youtube";

export default function Theater() {
  // current lesson details
  const lesson = getLesson(useAtomValue(lessonAtom)).lesson ?? getLatest();

  // scroll to top when lesson changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [lesson?.id]);

  return (
    <section className="wide">
      <Heading level={1} className="sr-only">
        Home
      </Heading>
      <Heading level={2} className="sr-only">
        Theater
      </Heading>
      <div className="flex flex-col gap-4">
        <div className="flex gap-4">
          <div
            className="
              grid flex-1 grid-rows-3 gap-4
              *:aspect-video *:bg-off-white
              max-lg:hidden
            "
          >
            <div />
            <div />
            <div />
          </div>
          <div className="aspect-video flex-3 bg-light-gray">
            <img
              src={getThumbnail(lesson?.video ?? "")}
              alt=""
              className="size-full object-cover"
            />
          </div>
          <div
            className="
              grid flex-1 grid-rows-3 gap-4
              *:aspect-video *:bg-off-white
              max-lg:hidden
            "
          >
            <div />
            <div />
            <div />
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="text-lg">{lesson?.title}</div>
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
