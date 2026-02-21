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
import Youtube, { play, playingAtom } from "~/components/Youtube";
import {
  getLatest,
  getLesson,
  getNextByDate,
  getNextByTopic,
  getPreviousByDate,
  getPreviousByTopic,
  getRandom,
} from "~/data/lessons";
import { useRouteExists } from "~/routes";
import { formatDate } from "~/util/string";
import { share } from "~/util/url";
import { lessonAtom, topicAtom } from "./Explore";

export default function Theater() {
  // current lesson
  const [, setLessonId] = useAtom(lessonAtom);

  // latest lesson details
  const latest = getLatest();

  // current lesson details
  const lesson = getLesson(useAtomValue(lessonAtom)).lesson ?? latest;

  // is this latest lesson
  const isLatest = latest?.id === lesson?.id;

  // link to readable lesson
  const readLink = lesson ? href(`/`) : "";

  // does readable lesson exist
  const readExists = useRouteExists(readLink);

  // show video details
  const [details, setDetails] = useState(false);

  // is video playing
  const playing = useAtomValue(playingAtom);

  // current topic
  const topic = useAtomValue(topicAtom);

  // previous video
  const previous =
    lesson &&
    (topic ? getPreviousByTopic(lesson.id) : getPreviousByDate(lesson.id));

  // next video
  const next =
    lesson && (topic ? getNextByTopic(lesson.id) : getNextByDate(lesson.id));

  return (
    <>
      <h1 className="sr-only">Home</h1>
      <h2 className="sr-only">Theater</h2>

      <div className="flex w-250 max-w-full flex-col gap-4 self-center transition">
        <Youtube
          id={lesson?.video ?? ""}
          className="aspect-video w-full self-center border border-black"
          style={{
            filter: playing ? `url("${backlight}#filter")` : undefined,
          }}
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

        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="small"
            onClick={() => {
              setLessonId(getRandom().id);
              play();
            }}
          >
            <DiceThreeIcon />
            Random
          </Button>
          {previous && (
            <Button
              size="small"
              onClick={() => {
                setLessonId(previous.id);
                play();
              }}
            >
              <CaretLeftIcon />
              Previous
            </Button>
          )}
          {next && (
            <Button
              size="small"
              onClick={() => {
                setLessonId(next.id);
                play();
              }}
            >
              Next
              <CaretRightIcon />
            </Button>
          )}
          {latest && !isLatest && (
            <Button
              size="small"
              onClick={() => {
                setLessonId(latest.id);
                play();
              }}
            >
              Latest
              <CaretDoubleRightIcon />
            </Button>
          )}
        </div>
      </div>
    </>
  );
}
