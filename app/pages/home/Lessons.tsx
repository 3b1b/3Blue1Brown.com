import type { TopicId } from "~/pages/lessons/topics";
import { useEffect, useMemo, useRef, useState } from "react";
import { href, useLocation } from "react-router";
import {
  BookOpenTextIcon,
  CaretDownIcon,
  CaretUpIcon,
  MagnifyingGlassIcon,
  PlayIcon,
  XIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useAtom, useAtomValue } from "jotai";
import Button from "~/components/Button";
import Card from "~/components/Card";
import { H2 } from "~/components/Heading";
import TextBox from "~/components/TextBox";
import { userSelected } from "~/pages/home/Theater";
import { byDate, getLesson } from "~/pages/lessons/lessons";
import { topics } from "~/pages/lessons/topics";
import { atomWithQuery, getAtom } from "~/util/atom";
import { preserveScroll, scrollTo } from "~/util/dom";
import { useFuzzySearch } from "~/util/hooks";
import { mergeSearch } from "~/util/url";

const limit = 12;

// global selected topic
export const topicAtom = atomWithQuery("topic");
// global search query
export const searchAtom = atomWithQuery("search", 1000);
// global selected lesson
export const lessonAtom = atomWithQuery("lesson");

export default function Lessons() {
  return (
    <section className="@container">
      <H2>
        <hr />
        Lessons
        <hr />
      </H2>

      <Search />
    </section>
  );
}

export function Search({ close = () => {} }) {
  const searchBox = useRef<HTMLInputElement>(null);

  // current topic
  const topicId = useAtomValue(topicAtom);

  // current topic details
  const topic = topicId in topics ? topics[topicId as TopicId] : undefined;

  // current lesson
  const lessonId = useAtomValue(lessonAtom);

  // current topic lesson details
  const lessons = useMemo(
    // make stable reference
    () =>
      (topic?.lessons ?? byDate)
        ?.map((id) => getLesson(id)?.frontmatter)
        .filter((lesson) => !!lesson),
    [topic],
  );

  // current search
  const [search, setSearch] = useAtom(searchAtom);

  // search results
  let results = useFuzzySearch(lessons, search);

  // display newest to oldest for certain topics
  if (["all", "best-of"].includes(topicId)) results = results.toReversed();

  // show all or truncate results
  const [all, setAll] = useState(false);

  // current route
  const location = useLocation();

  // on page load
  useEffect(() => {
    // if user just navigated to topic/search, scroll to section
    if ((getAtom(topicAtom) || getAtom(searchAtom)) && !getAtom(lessonAtom))
      scrollTo(searchBox.current, { behavior: "instant" });
  }, []);

  return (
    <>
      <TextBox
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
        <div className="relative isolate grid grid-cols-3 gap-8 @max-md:grid-cols-2 @max-sm:grid-cols-1">
          <div className="absolute -inset-x-999 inset-y-0 -z-10 bg-secondary/10" />
          <img
            src={topic.image ?? ""}
            alt=""
            className="size-full object-cover"
          />
          <div className="flex grow items-center gap-4 @md:col-span-2">
            <div className="flex grow flex-col gap-2">
              <div className="w-max shrink-0 font-sans text-lg font-medium">
                {topic.title}
              </div>
              <div>{topic.description}</div>
            </div>
            <Button
              to={{ search: mergeSearch(location.search, `topic=`) }}
              onClick={userSelected}
              aria-label="Clear topic"
            >
              <XIcon />
            </Button>
          </div>
        </div>
      )}

      {/* topic cards */}
      {!topicId?.trim() && !search.trim() ? (
        <div
          id="results"
          className="grid grid-cols-3 gap-8 @max-md:grid-cols-2 @max-sm:grid-cols-1"
        >
          {Object.entries(topics).map(([id, { title, image }], index) => (
            <Card
              key={index}
              to={{ search: mergeSearch(location.search, `topic=${id}`) }}
              image={image}
              title={title}
              onClick={(event) => {
                // only if not in header search popup
                if (event.currentTarget?.closest("section"))
                  // scroll up to search box
                  scrollTo(searchBox.current, { behavior: "instant" });
              }}
              aria-label={`Explore topic "${title}"`}
            />
          ))}
        </div>
      ) : results.length ? (
        <>
          {/* search result cards */}
          <div id="results" className="grid grid-cols-1 gap-8">
            {results
              .slice(0, all ? Infinity : limit)
              .map(
                (
                  { id = "", title = "", description = "", image = "", read },
                  index,
                ) => (
                  <div key={index} className="relative max-lg:contents">
                    <Card
                      to={{
                        pathname: "/",
                        search: mergeSearch(location.search, `lesson=${id}`),
                      }}
                      direction="row"
                      image={image}
                      title={title}
                      description={description}
                      className={clsx(lessonId === id && "opacity-50")}
                      onClick={() => {
                        userSelected();
                        close();
                      }}
                      aria-label={`Play lesson "${title}"`}
                      aria-current={lessonId === id}
                    >
                      {lessonId === id && (
                        <div className="absolute -top-4 -left-4 grid size-8 place-items-center rounded-full bg-theme text-white">
                          <PlayIcon />
                        </div>
                      )}
                    </Card>
                    {read && (
                      <Button
                        size="sm"
                        color="light"
                        to={href("/lessons/:id", { id })}
                        className="right-full bottom-1/2 justify-self-start lg:absolute lg:-translate-x-1/2 lg:translate-y-1/2"
                        onClick={close}
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
        <div className="text-center text-gray">No results</div>
      )}
    </>
  );
}
