import type { TopicId } from "~/pages/lessons/topics";
import { useEffect, useMemo, useRef, useState } from "react";
import { href, useLocation } from "react-router";
import {
  BookOpenTextIcon,
  CaretDownIcon,
  CaretUpIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import { useAtom, useAtomValue } from "jotai";
import Button from "~/components/Button";
import Card from "~/components/Card";
import { H2 } from "~/components/Heading";
import Textbox from "~/components/Textbox";
import { userSelected } from "~/pages/home/Theater";
import { byDate, getLesson, hasContent } from "~/pages/lessons/lessons";
import { topics } from "~/pages/lessons/topics";
import { atomWithQuery, getAtom } from "~/util/atom";
import { preserveScroll, scrollTo } from "~/util/dom";
import { useFuzzySearch } from "~/util/hooks";
import { mergeSearch } from "~/util/url";

const limit = 12;

export const topicAtom = atomWithQuery("topic");
export const searchAtom = atomWithQuery("search", 1000);
export const lessonAtom = atomWithQuery("lesson");

export default function Explore() {
  return (
    <section className="@container">
      <H2>
        <hr />
        Explore
        <hr />
      </H2>

      <Search />
    </section>
  );
}

export function Search() {
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
  const results = useFuzzySearch(lessons, search);

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
        <div className="relative isolate grid grid-cols-3 gap-8 @max-md:grid-cols-2 @max-sm:grid-cols-1">
          <div className="absolute inset-y-0 -right-999 -left-999 -z-10 bg-off-white" />
          <img
            src={topic.image ?? ""}
            alt=""
            className="size-full object-cover"
          />
          <div className="flex grow items-center gap-4 p-4 @md:col-span-2">
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
          <div
            id="results"
            className="grid grid-cols-3 gap-8 @max-md:grid-cols-2 @max-sm:grid-cols-1"
          >
            {results
              .slice(0, all ? Infinity : limit)
              .map(
                (
                  { id = "", title = "", description = "", image = "" },
                  index,
                ) => (
                  <div key={index} className="flex flex-col gap-2">
                    <Card
                      to={{
                        pathname: "/",
                        search: mergeSearch(location.search, `lesson=${id}`),
                      }}
                      aria-label={`Play lesson "${title}"`}
                      image={image}
                      title={title}
                      description={description}
                      onClick={userSelected}
                      active={lessonId === id}
                    />
                    {hasContent(id) && (
                      <Button
                        size="sm"
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
    </>
  );
}
