import type { ComponentProps, ReactNode } from "react";
import type { Lesson } from "~/pages/lessons/lessons";
import type { TopicId } from "~/pages/lessons/topics";
import { useEffect, useState } from "react";
import { href, useLocation, useNavigate } from "react-router";
import {
  BookOpenTextIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  CaretUpIcon,
  DiceThreeIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import Button from "~/components/Button";
import { H1, H2 } from "~/components/Heading";
import { play, stop, videoPlayingAtom } from "~/components/video";
import YouTube from "~/components/YouTube";
import {
  getFirst,
  getLast,
  getLesson,
  getNext,
  getPrevious,
  getRandom,
} from "~/pages/lessons/lessons";
import { topics } from "~/pages/lessons/topics";
import { getAtom } from "~/util/atom";
import { autoHeight } from "~/util/hooks";
import { formatDate } from "~/util/string";
import { mergeSearch } from "~/util/url";
import { lessonAtom, topicAtom } from "./Lessons";

// flag for whether to autoplay on next video load
let autoplay: boolean | undefined = undefined;
// set autoplay flag
export const setAutoplay = (value: typeof autoplay) => (autoplay = value);

// home page theater section
export default function Theater() {
  const navigate = useNavigate();

  // selected lesson id
  const lessonId = useAtomValue(lessonAtom);

  // latest lesson by date
  const latest = getLast()?.frontmatter;

  // current lesson (or latest if none selected) details
  const lesson = getLesson(lessonId)?.frontmatter ?? latest;

  // current topic id
  const topicId = useAtomValue(topicAtom) || "all";

  // current topic details
  const topic = topicId in topics ? topics[topicId as TopicId] : undefined;

  // current topic lesson list
  const topicLessons = topic?.lessons
    ? topic.lessons.filter((id) => getLesson(id)?.frontmatter.video)
    : undefined;

  // first lesson in list
  const first =
    // handle rare case where selected lesson not in selected topic
    topicLessons?.includes(lesson?.id ?? "")
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
    topicLessons?.includes(lesson?.id ?? "")
      ? getLast(topicLessons)?.frontmatter
      : undefined;

  // link to readable lesson
  const readLink = lesson?.id ? href(`/lessons/:id`, { id: lesson?.id }) : "";

  // show video details
  const [details, setDetails] = useState(false);

  // when current lesson changes (after nav)
  useEffect(() => {
    if (autoplay === true) play();
    if (autoplay === false) stop();
    // reset after use
    setAutoplay(undefined);
  }, [lesson?.id]);

  return (
    <>
      <H1 className="sr-only">Home</H1>
      <H2 className="sr-only">Theater</H2>

      <div className="flex w-250 max-w-full flex-col gap-4 self-center transition">
        <YouTube
          id={lesson?.video ?? ""}
          className="self-center border border-black"
          backlight
        />

        <div className="flex items-center justify-center gap-8 max-md:flex-col max-md:text-center">
          {/* title */}
          <div className="font-sans text-lg">
            {lesson?.title}
            {lesson?.id === latest?.id && <sup className="badge">New</sup>}
          </div>

          {/* actions */}
          <div className="flex flex-wrap gap-4">
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
              {details ? <CaretUpIcon /> : <CaretDownIcon />}
              Details
            </Button>
          </div>
        </div>

        <div
          ref={(element) => autoHeight(element, details)}
          className={clsx(
            "flex flex-col gap-4 overflow-y-clip rounded-md bg-theme/15 p-4 transition-all",
            details ? "" : "pointer-events-none -mb-2 py-0",
          )}
        >
          <strong>{formatDate(lesson?.date)}</strong>
          <p>{lesson?.description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 max-sm:gap-2">
          {/* controls */}
          <Button
            size="sm"
            onClick={() => {
              const random = getRandom(lesson?.id, topicLessons)?.frontmatter;
              const to = "?lesson=" + (random?.id ?? "");
              navigate(to);
              setAutoplay(getAtom(videoPlayingAtom));
            }}
            aria-label="Random lesson in topic"
          >
            <DiceThreeIcon />
          </Button>
          <Nav
            current={lesson}
            target={first}
            aria-label="First lesson in topic"
          >
            <CaretDoubleLeftIcon />
          </Nav>
          <Nav
            current={lesson}
            target={previous}
            aria-label="Previous lesson in topic"
          >
            <CaretLeftIcon />
          </Nav>
          <Nav current={lesson} target={next} aria-label="Next lesson in topic">
            <CaretRightIcon />
          </Nav>
          <Nav current={lesson} target={last} aria-label="Last lesson in topic">
            <CaretDoubleRightIcon />
          </Nav>

          {/* <div className="badge bg-gray">{topic?.title}</div> */}
        </div>
      </div>
    </>
  );
}

type ControlProps = {
  current?: Lesson["frontmatter"];
  target?: Lesson["frontmatter"];
  children: ReactNode;
} & ComponentProps<typeof Button>;

// nav control button under player
function Nav({ current, target, children, ...props }: ControlProps) {
  // current route
  const location = useLocation();

  return (
    <Button
      size="sm"
      to={{
        search: mergeSearch(location.search, "?lesson=" + (target?.id ?? "")),
      }}
      onClick={() => setAutoplay(getAtom(videoPlayingAtom))}
      aria-disabled={!target || current?.id === target?.id}
      {...props}
    >
      {children}
    </Button>
  );
}
