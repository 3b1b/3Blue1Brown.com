import type { ReactNode } from "react";
import type { Lesson } from "~/pages/lessons/lessons";
import type { TopicId } from "~/pages/lessons/topics";
import { useEffect, useRef, useState } from "react";
import { href, useLocation, useNavigate } from "react-router";
import {
  BookOpenTextIcon,
  CaretDoubleLeftIcon,
  CaretDoubleRightIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  DiceThreeIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import Button from "~/components/Button";
import { H1, H2 } from "~/components/Heading";
import Tooltip from "~/components/Tooltip";
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
import { useAutoHeight } from "~/util/hooks";
import { formatDate } from "~/util/string";
import { mergeSearch } from "~/util/url";
import { lessonAtom, topicAtom } from "./Lessons";

// flag for whether to autoplay on next video load
let autoplay: boolean | undefined = undefined;
// set autoplay flag
export const setAutoplay = (value: typeof autoplay) => (autoplay = value);

// home page theater section
export default function Theater() {
  const detailsRef = useRef<HTMLDivElement>(null);

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

  // current topic name
  const topicName = topic?.title || "All";

  // current topic lesson list
  const topicLessons = topic?.lessons
    ? topic.lessons.filter((id) => getLesson(id)?.frontmatter.video)
    : undefined;

  // handle (rare?) case where selected lesson not in selected topic
  const lessonInTopic = topicLessons?.includes(lesson?.id ?? "");

  // first lesson in list
  const first = lessonInTopic ? getFirst(topicLessons)?.frontmatter : undefined;

  // previous lesson in list
  const previous =
    lesson && lessonInTopic
      ? getPrevious(lesson.id, topicLessons)?.frontmatter
      : undefined;

  // next lesson in list
  const next =
    lesson && lessonInTopic
      ? getNext(lesson.id, topicLessons)?.frontmatter
      : undefined;

  // last lesson in list
  const last = lessonInTopic ? getLast(topicLessons)?.frontmatter : undefined;

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

  // animate height on open/close
  useAutoHeight(detailsRef, details);

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
              <CaretDownIcon
                className={clsx("icon transition", details ? "rotate-180" : "")}
              />
              Details
            </Button>
          </div>
        </div>

        <div
          ref={detailsRef}
          className={clsx(
            "flex flex-col gap-4 overflow-y-clip rounded-md bg-theme/15 p-4 transition-all",
            details ? "" : "pointer-events-none -mb-12 opacity-0 select-none",
          )}
        >
          <strong>{formatDate(lesson?.date)}</strong>
          <p>{lesson?.description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 max-sm:gap-2">
          {/* controls */}
          <Nav
            onClick={() => {
              const random = getRandom(lesson?.id)?.frontmatter;
              const to = "?lesson=" + (random?.id ?? "");
              navigate(to);
              setAutoplay(getAtom(videoPlayingAtom));
            }}
            label="Random lesson"
          >
            <DiceThreeIcon />
          </Nav>
          <Nav
            current={lesson}
            target={first}
            label={`First lesson in "${topicName}"`}
          >
            <CaretDoubleLeftIcon />
          </Nav>
          <Nav
            current={lesson}
            target={previous}
            label={`Previous lesson in "${topicName}"`}
          >
            <CaretLeftIcon />
          </Nav>
          <Nav
            current={lesson}
            target={next}
            label={`Next lesson in "${topicName}"`}
          >
            <CaretRightIcon />
          </Nav>
          <Nav
            current={lesson}
            target={last}
            label={`Last lesson in "${topicName}"`}
          >
            <CaretDoubleRightIcon />
          </Nav>
        </div>
      </div>
    </>
  );
}

type ControlProps = {
  label: string;
  current?: Lesson["frontmatter"];
  target?: Lesson["frontmatter"];
  onClick?: () => void;
  children: ReactNode;
};

// nav control button under player
function Nav({ label, current, target, onClick, children }: ControlProps) {
  // current route
  const location = useLocation();

  // props to pass to button
  const props = onClick
    ? // button
      { onClick }
    : // link
      {
        to: {
          search: mergeSearch(location.search, "?lesson=" + (target?.id ?? "")),
        },
        onClick: () => setAutoplay(getAtom(videoPlayingAtom)),
        ["aria-disabled"]: !target || current?.id === target?.id,
      };

  return (
    <Tooltip
      trigger={
        <Button size="sm" aria-label={label} {...props}>
          {children}
        </Button>
      }
      button={!!onClick}
    >
      {label}
    </Tooltip>
  );
}
