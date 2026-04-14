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
import { useUnmount } from "@reactuses/core";
import clsx from "clsx";
import { useAtomValue } from "jotai";
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
import { autoHeight } from "~/util/hooks";
import { formatDate } from "~/util/string";
import { mergeSearch } from "~/util/url";
import { lessonAtom, topicAtom } from "./Lessons";

// has user explicitly selected a lesson
let userSelected = false;
// mark that user explicitly selected a lesson
export const userSelect = () => (userSelected = true);

// home page theater section
export default function Theater() {
  // current lesson
  const lessonId = useAtomValue(lessonAtom);

  // latest lesson by date
  const latest = getLast()?.frontmatter;

  // current lesson details
  const lesson = getLesson(lessonId)?.frontmatter ?? latest;

  // current topic id
  const topicId = useAtomValue(topicAtom) || "all";

  // current topic details
  const topic = topicId in topics ? topics[topicId as TopicId] : undefined;

  // current topic lesson list
  const topicLessons = topic?.lessons
    ? topic.lessons.filter((id) => getLesson(id)?.frontmatter.video)
    : undefined;

  // random lesson in list
  const random = getRandom(lessonId, topicLessons)?.frontmatter;

  // first lesson in list
  const first =
    // handle rare case where selected lesson not in selected topic
    topicLessons?.includes(lessonId)
      ? getFirst(topicLessons)?.frontmatter
      : undefined;

  // previous lesson in list
  const previous =
    lesson && getPrevious(lesson.id ?? "", topicLessons)?.frontmatter;

  // next lesson in list
  const next = lesson && getNext(lesson.id ?? "", topicLessons)?.frontmatter;

  // last lesson in list
  const last =
    // handle rare case where selected lesson not in selected topic
    topicLessons?.includes(lessonId)
      ? getLast(topicLessons)?.frontmatter
      : undefined;

  // link to readable lesson
  const readLink = lesson?.id ? href(`/lessons/:id`, { id: lesson?.id }) : "";

  // show video details
  const [details, setDetails] = useState(false);

  // is video playing
  const playing = useAtomValue(playingAtom);

  // when lesson changes, start playing
  useEffect(() => {
    // only auto-play if user explicitly selected
    if (userSelected) play();
  }, [lessonId]);

  useUnmount(() => {
    // reset user selection on page exit
    userSelected = false;
  });

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
          <div className="flex flex-wrap items-center justify-center gap-4 max-md:gap-2">
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

        <div
          ref={(element) => autoHeight(element, details)}
          className={clsx(
            "flex flex-col gap-4 overflow-y-clip transition-all",
            !details && "-mb-4",
          )}
        >
          <p>{formatDate(lesson?.date)}</p>
          <p>{lesson?.description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 max-sm:gap-2">
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
      onClick={userSelect}
      aria-disabled={!target || current?.id === target?.id}
      {...props}
    >
      {children}
    </Button>
  );
}
