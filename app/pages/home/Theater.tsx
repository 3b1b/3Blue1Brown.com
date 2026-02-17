import { useState } from "react";
import {
  BookOpenTextIcon,
  InfoIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import Youtube, { playingAtom } from "~/components/Youtube";
import { getLatest, getLesson } from "~/data/lessons";
import { lessonAtom } from "~/pages/home/Explore";
import { useRouteExists } from "~/routes";
import { formatDate } from "~/util/string";
import { share } from "~/util/url";

export default function Theater() {
  // current lesson details
  const lesson = getLesson(useAtomValue(lessonAtom)).lesson ?? getLatest();

  // is this latest lesson
  const isLatest = getLatest()?.id === lesson?.id;

  // link to readable lesson
  const readLink = lesson ? `/lessons/${lesson.id}` : "";

  // does readable lesson exist
  const readExists = useRouteExists(readLink);

  // show video details
  const [details, setDetails] = useState(false);

  const playing = useAtomValue(playingAtom);

  return (
    <>
      <Heading level={1} className="sr-only">
        Home
      </Heading>
      <Heading level={2} className="sr-only">
        Theater
      </Heading>

      <div
        className={clsx(
          "flex max-w-full flex-col gap-4 self-center transition-all",
          playing ? "w-300" : "w-250",
        )}
      >
        <Youtube
          id={lesson?.video ?? ""}
          className="aspect-video w-full self-center border border-black"
        />

        <div className="flex flex-wrap items-center justify-center gap-4">
          <div className="grow font-sans text-lg">
            {lesson?.title}
            {isLatest && <sup className="badge">New</sup>}
          </div>

          {readExists && (
            <Button size="small" to={readLink}>
              <BookOpenTextIcon />
              Read
            </Button>
          )}
          <Button
            size="small"
            onClick={() => setDetails(!details)}
            aria-expanded={details}
            aria-controls="theater-details"
          >
            <InfoIcon />
            Details
          </Button>
          <Button size="small" onClick={share}>
            <ShareNetworkIcon />
            Share
          </Button>
        </div>
        {details && (
          <div id="theater-details" className="flex flex-col gap-4">
            <p>{formatDate(lesson?.date)}</p>
            <p>{lesson?.description}</p>
          </div>
        )}
      </div>
    </>
  );
}
