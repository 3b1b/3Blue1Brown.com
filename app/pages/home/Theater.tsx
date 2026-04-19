import type { ComponentProps, ReactNode } from "react";
import type { Lesson } from "~/pages/lessons/lessons";
import type { TopicId } from "~/pages/lessons/topics";
import { useEffect, useState } from "react";
import { href, useLocation, useNavigate } from "react-router";
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
import { getLocalization } from "~/pages/lessons/localizations";
import { topics } from "~/pages/lessons/topics";
import { autoHeight } from "~/util/hooks";
import { formatDate } from "~/util/string";
import { mergeSearch } from "~/util/url";
import { languageAtom } from "./LanguageFilter";
import { lessonAtom, topicAtom } from "./Lessons";

const audioCallouts: Record<string, string> = {
  hi: "हिन्दी ऑडियो ट्रैक सुनने के लिए, वीडियो सेटिंग्स (गियर आइकन) → ऑडियो ट्रैक → हिन्दी पर जाएं",
  fr: "Pour écouter la piste audio en français, allez dans les paramètres vidéo (icône d'engrenage) → Piste audio → Français",
  es: "Para escuchar la pista de audio en español, ve a configuración del video (icono de engranaje) → Pista de audio → Español",
  ru: "Чтобы услышать звуковую дорожку на русском, перейдите в настройки видео (значок шестерёнки) → Звуковая дорожка → Русский",
};

// has user explicitly selected a lesson
let userSelected = false;
// mark that user explicitly selected a lesson
export const userSelect = () => (userSelected = true);

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

  // localized title/description when language filter is active
  const languageCode = useAtomValue(languageAtom);
  const loc = getLocalization(lesson?.id ?? "", languageCode);

  // show video details
  const [details, setDetails] = useState(false);

  // is video playing
  const playing = useAtomValue(playingAtom);

  // when lesson changes, start playing
  useEffect(() => {
    // only auto-play if user explicitly selected
    if (userSelected) play();
  }, [lesson?.id]);

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
            {loc?.title ?? lesson?.title}
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

        {languageCode && lesson?.video && audioCallouts[languageCode] && (
          <p className="text-sm text-gray">{audioCallouts[languageCode]}</p>
        )}

        <div
          ref={(element) => autoHeight(element, details)}
          className={clsx(
            "flex flex-col gap-4 overflow-y-clip transition-all",
            !details && "-mb-4",
          )}
        >
          <p>{formatDate(lesson?.date)}</p>
          <p>{loc?.description ?? lesson?.description}</p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 max-sm:gap-2">
          {/* controls */}
          <Button
            size="sm"
            onClick={() => {
              const random = getRandom(lesson?.id, topicLessons)?.frontmatter;
              const to = "?lesson=" + (random?.id ?? "");
              navigate(to);
            }}
          >
            <DiceThreeIcon />
            Random
          </Button>
          <Nav current={lesson} target={first}>
            <CaretDoubleLeftIcon />
            First
          </Nav>
          <Nav current={lesson} target={previous}>
            <CaretLeftIcon />
            Previous
          </Nav>
          <Nav current={lesson} target={next}>
            Next
            <CaretRightIcon />
          </Nav>
          <Nav current={lesson} target={last}>
            Last
            <CaretDoubleRightIcon />
          </Nav>
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
      aria-disabled={!target || current?.id === target?.id}
      {...props}
    >
      {children}
    </Button>
  );
}
