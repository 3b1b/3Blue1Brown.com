import { useState } from "react";
import { href } from "react-router";
import {
  BookOpenTextIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  DiceThreeIcon,
  InfoIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react";
import { useAtom, useAtomValue } from "jotai";
import backlight from "~/components/backlight.svg?inline";
import Button from "~/components/Button";
import { H1, H2 } from "~/components/Heading";
import YouTube, { play, playingAtom } from "~/components/YouTube";
import {
  getLatest,
  getLesson,
  getNextByDate,
  getPreviousByDate,
  getRandom,
  hasText,
} from "~/pages/lessons/lessons";
import { getNextByTopic, getPreviousByTopic } from "~/pages/lessons/topics";
import { formatDate } from "~/util/string";
import { share } from "~/util/url";
import { lessonAtom, topicAtom } from "./Explore";

export default function Theater() {
  // current lesson
  const [, setLessonId] = useAtom(lessonAtom);

  // latest lesson details
  const latest = getLatest()?.frontmatter;

  // current lesson details
  const lesson = getLesson(useAtomValue(lessonAtom))?.frontmatter ?? latest;

  // is this latest lesson
  const isLatest = latest?.id === lesson?.id;

  // link to readable lesson
  const readLink = lesson?.id ? href(`/lessons/:id`, { id: lesson?.id }) : "";

  // does readable lesson exist
  const readExists = hasText(lesson?.id ?? "");

  // show video details
  const [details, setDetails] = useState(false);

  // is video playing
  const playing = useAtomValue(playingAtom);

  // current topic
  const topic = useAtomValue(topicAtom);

  // previous video
  const previous =
    lesson &&
    (topic
      ? getPreviousByTopic(lesson.id ?? "")
      : getPreviousByDate(lesson.id ?? ""));

  // next video
  const next =
    lesson &&
    (topic ? getNextByTopic(lesson.id ?? "") : getNextByDate(lesson.id ?? ""));

  return (
    <>
      <H1 className="sr-only">Home</H1>
      <H2 className="sr-only">Theater</H2>

      <div className="flex w-250 max-w-full flex-col gap-4 self-center transition">
        <YouTube
          id={lesson?.video ?? ""}
          className="self-center border border-black"
          style={{
            filter: playing ? `url("${backlight}#filter")` : undefined,
          }}
        />

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* title */}
          <div className="grow font-sans text-lg">
            {lesson?.title}
            {isLatest && <sup className="badge">New</sup>}
          </div>

          {/* actions */}
          {readExists && (
            <Button size="sm" to={readLink}>
              <BookOpenTextIcon />
              Read
            </Button>
          )}
          <Button
            size="sm"
            onClick={() => setDetails(!details)}
            aria-expanded={details}
            aria-controls="theater-details"
          >
            <InfoIcon />
            Details
          </Button>
          <Button size="sm" onClick={share}>
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

        <div />

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* controls */}
          <Button
            size="sm"
            onClick={() => {
              setLessonId(getRandom()?.frontmatter?.id ?? "");
              play();
            }}
          >
            <DiceThreeIcon />
            Random
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (!previous) return;
              setLessonId(previous?.frontmatter?.id ?? "");
              play();
            }}
            aria-disabled={!previous}
          >
            <CaretLeftIcon />
            Previous
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (!next) return;
              setLessonId(next?.frontmatter?.id ?? "");
              play();
            }}
            aria-disabled={!next}
          >
            Next
            <CaretRightIcon />
          </Button>
          <Button
            size="sm"
            onClick={() => {
              if (!latest || isLatest) return;
              setLessonId(latest?.id ?? "");
              play();
            }}
            aria-disabled={!latest || isLatest}
          >
            Latest
            <CaretDoubleRightIcon />
          </Button>
        </div>
      </div>
    </>
  );
}
