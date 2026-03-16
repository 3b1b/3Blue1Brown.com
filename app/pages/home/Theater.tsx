import type { ComponentProps, ReactNode } from "react";
import type { LessonFrontmatter } from "~/pages/lessons/lessons";
import type { TopicId } from "~/pages/lessons/topics";
import { useEffect, useState } from "react";
import { href, useLocation } from "react-router";
import {
  BookOpenTextIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  DiceThreeIcon,
  InfoIcon,
} from "@phosphor-icons/react";
import { atom, useAtomValue } from "jotai";
import backlight from "~/components/backlight.svg?inline";
import Button from "~/components/Button";
import { H1, H2 } from "~/components/Heading";
import YouTube, { play, playingAtom } from "~/components/YouTube";
import {
  getFirst,
  getLast,
  getLesson,
  getNext,
  getPrevious,
  getRandom,
} from "~/pages/lessons/lessons";
import { topics } from "~/pages/lessons/topics";
import { getAtom, setAtom } from "~/util/atom";
import { formatDate } from "~/util/string";
import { mergeSearch } from "~/util/url";
import { lessonAtom, topicAtom } from "./Explore";

// has user explicitly selected a lesson
export const selectedAtom = atom(false);
// mark that user explicitly selected a lesson
export const userSelected = () => setAtom(selectedAtom, true);

export default function Theater() {
  // current lesson
  const lessonId = useAtomValue(lessonAtom);

  // latest lesson by date
  const latest = getLast()?.frontmatter;

  // current lesson details
  const lesson = getLesson(lessonId)?.frontmatter ?? latest;

  // current topic id
  const topicId = useAtomValue(topicAtom);

  // current topic details
  const topic = topicId in topics ? topics[topicId as TopicId] : undefined;

  // current topic lesson list
  const topicLessons = topic?.lessons ?? undefined;

  // random lesson in list
  const random = getRandom(lessonId, topicLessons)?.frontmatter;

  // first lesson in list
  const first = getFirst(topicLessons)?.frontmatter;

  // previous lesson in list
  const previous =
    lesson && getPrevious(lesson.id ?? "", topicLessons)?.frontmatter;

  // next lesson in list
  const next = lesson && getNext(lesson.id ?? "", topicLessons)?.frontmatter;

  // last lesson in list
  const last = getLast(topicLessons)?.frontmatter;

  // link to readable lesson
  const readLink = lesson?.id ? href(`/lessons/:id`, { id: lesson?.id }) : "";

  // show video details
  const [details, setDetails] = useState(false);

  // is video playing
  const playing = useAtomValue(playingAtom);

  // when lesson changes, start playing
  useEffect(() => {
    // only auto-play if user explicitly selected
    if (getAtom(selectedAtom)) play();
  }, [lessonId]);

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

        <div className="flex items-center justify-center gap-4 max-md:flex-col max-md:text-center">
          {/* title */}
          <div className="grow font-sans text-lg">
            {lesson?.title}
            {lesson?.id === latest?.id && <sup className="badge">New</sup>}
          </div>

          {/* actions */}
          <div className="flex flex-wrap items-center justify-center gap-4">
            {lesson?.read && (
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
          </div>
        </div>

        {details && (
          <div id="theater-details" className="flex flex-col gap-4">
            <p>{formatDate(lesson?.date)}</p>
            <p>{lesson?.description}</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-4">
          {/* controls */}
          <Control current={lesson} target={random} suppressHydrationWarning>
            <DiceThreeIcon />
            Random
          </Control>
          <Control current={lesson} target={first}>
            <CaretDoubleLeftIcon />
            First
          </Control>
          <Control current={lesson} target={previous}>
            <CaretLeftIcon />
            Previous
          </Control>
          <Control current={lesson} target={next}>
            Next
            <CaretRightIcon />
          </Control>
          <Control current={lesson} target={last}>
            Last
            <CaretDoubleRightIcon />
          </Control>
        </div>
      </div>
    </>
  );
}

type ControlProps = {
  current?: LessonFrontmatter;
  target?: LessonFrontmatter;
  children: ReactNode;
} & ComponentProps<typeof Button>;

// control button under player
function Control({ current, target, children, ...props }: ControlProps) {
  // current route
  const location = useLocation();

  return (
    <Button
      size="sm"
      to={{
        search: mergeSearch(location.search, "?lesson=" + (target?.id ?? "")),
      }}
      onClick={userSelected}
      aria-disabled={!target || current?.id === target?.id}
      {...props}
    >
      {children}
    </Button>
  );
}
