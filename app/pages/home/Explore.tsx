import type { TopicId } from "~/pages/lessons/topics";
import { useEffect, useMemo, useRef, useState } from "react";
import { href } from "react-router";
import {
  BookOpenTextIcon,
  CaretDownIcon,
  CaretUpIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import Button from "~/components/Button";
import { H2 } from "~/components/Heading";
import Link from "~/components/Link";
import Textbox from "~/components/Textbox";
import { play } from "~/components/YouTube";
import { byDate, getLesson, hasContent } from "~/pages/lessons/lessons";
import { topics } from "~/pages/lessons/topics";
import { atomWithQuery, getAtom } from "~/util/atom";
import { preserveScroll, scrollTo } from "~/util/dom";
import { useFuzzySearch } from "~/util/hooks";
import { getThumbnail } from "~/util/youtube";

const limit = 12;

export const topicAtom = atomWithQuery("topic");
export const searchAtom = atomWithQuery("search", 1000);
export const lessonAtom = atomWithQuery("lesson");

export default function Explore() {
  const searchBox = useRef<HTMLInputElement>(null);

  // current topic
  const topicId = useAtomValue(topicAtom);

  // current search
  const [search, setSearch] = useAtom(searchAtom);

  // current lesson
  const lessonId = useAtomValue(lessonAtom);

  // current topic details
  const topic = topicId in topics ? topics[topicId as TopicId] : undefined;

  // current topic lesson details
  const lessons = useMemo(
    // make stable reference
    () =>
      (topic?.lessons ?? byDate)
        ?.map((id) => getLesson(id)?.frontmatter)
        .filter((lesson) => !!lesson),
    [topic],
  );

  // search results
  const results = useFuzzySearch(lessons, search);

  // show all or truncate results
  const [all, setAll] = useState(false);

  // run once on page load
  useEffect(() => {
    // if user just navigated to topic/search, scroll to section
    if ((getAtom(topicAtom) || getAtom(searchAtom)) && !getAtom(lessonAtom))
      scrollTo(searchBox.current, { behavior: "instant" }, true);
  }, []);

  return (
    <section>
      <H2>
        <hr />
        Explore
        <hr />
      </H2>

      <Textbox
        ref={searchBox}
        icon={<MagnifyingGlassIcon />}
        value={search}
        onChange={setSearch}
        className="text-lg"
        placeholder="Search..."
        aria-controls="results"
      />

      {/* selected topic */}
      {topic && (
        <div className="relative isolate grid grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
          <div className="absolute -inset-y-4 -right-999 -left-999 -z-10 bg-off-white" />
          <img
            src={topic.image ?? ""}
            alt=""
            className="size-full object-cover"
          />
          <div className="flex grow items-center gap-4 p-4 md:col-span-2">
            <div className="flex grow flex-col gap-2">
              <div className="w-max shrink-0 font-sans text-lg font-medium">
                {topic.title}
              </div>
              <div>{topic.description}</div>
            </div>
            <Button to={{ search: "?topic=" }} merge aria-label="Clear topic">
              <XIcon />
            </Button>
          </div>
        </div>
      )}

      {/* topic cards */}
      {!topicId?.trim() && !search.trim() ? (
        <div
          id="results"
          className="grid grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1"
        >
          {Object.entries(topics).map(([id, { title, image }], index) => (
            <Link
              key={index}
              className="card"
              to={{ search: `?topic=${id}` }}
              merge
              onClick={() =>
                scrollTo(searchBox.current, { behavior: "instant" })
              }
              aria-label={`Explore topic "${title}"`}
            >
              <img src={image ?? ""} alt="" />
              <div className="font-sans font-medium">{title}</div>
            </Link>
          ))}
        </div>
      ) : results.length ? (
        <>
          {/* search result cards */}
          <div
            id="results"
            className="grid grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1"
          >
            {results
              .slice(0, all ? Infinity : limit)
              .map(
                (
                  { id = "", title = "", description = "", video = "" },
                  index,
                ) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Link
                      className="card"
                      to={{ search: `?lesson=${id}` }}
                      merge
                      onClick={play}
                      aria-label={`Play lesson "${title}"`}
                      aria-current={lessonId === id}
                    >
                      <img
                        src={getThumbnail(video)}
                        alt=""
                        className={clsx(lessonId === id && "opacity-50")}
                      />
                      <div className="font-sans font-medium">{title}</div>
                      <div className="line-clamp-3">{description}</div>
                      {lessonId === id && (
                        <div className="absolute -top-4 -right-4 grid size-8 place-items-center rounded-full bg-theme text-white">
                          <EyeIcon />
                        </div>
                      )}
                    </Link>
                    {hasContent(id) && (
                      <Button
                        size="sm"
                        color="light"
                        to={href("/lessons/:id", { id })}
                        className="mt-auto self-center"
                      >
                        <BookOpenTextIcon />
                        Read
                      </Button>
                    )}
                  </div>
                ),
              )}
          </div>

          {/* expand/collapse results */}
          {results.length > limit && (
            <Button
              className="self-center"
              color="theme"
              onClick={(event) => {
                if (all) preserveScroll(event.currentTarget);
                setAll(!all);
              }}
            >
              {all ? (
                <>
                  Show Less
                  <CaretUpIcon />
                </>
              ) : (
                <>
                  Show All
                  <CaretDownIcon />
                </>
              )}
            </Button>
          )}
        </>
      ) : (
        // empty
        <div className="text-center text-dark-gray">No results</div>
      )}
    </section>
  );
}
