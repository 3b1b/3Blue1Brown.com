import { useRef, useState } from "react";
import {
  CaretDownIcon,
  CaretUpIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  XIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { useAtom } from "jotai";
import { shuffle } from "lodash-es";
import Button from "~/components/Button";
import Heading from "~/components/Heading";
import Textbox from "~/components/Textbox";
import { play } from "~/components/Youtube";
import { byDate, lessons } from "~/data/lessons";
import { images } from "~/pages/home/images";
import { atomWithQuery } from "~/util/atom";
import { preserveScroll } from "~/util/dom";
import { useFuzzySearch } from "~/util/hooks";
import { getThumbnail } from "~/util/youtube";

const topics = [
  {
    id: "all",
    title: "All",
    description: "All lessons, newest to oldest",
    lessons: byDate,
  },
  // {
  //   id: "best of",
  //   title: "Best Of",
  //   description: "A few hand-picked favorite lessons",
  //   lessons: [],
  // },

  ...lessons,

  {
    id: "shuffle",
    title: "Shuffle",
    description: "All lessons, in random order. Refresh for a new shuffle!",
    lessons: shuffle(byDate),
  },
]
  .filter((topic) => !topic.id.match(/misc/i))
  .map((button) => ({ ...button, img: images[button.id] }));

const limit = 12;

export const topicAtom = atomWithQuery("topic");
export const searchAtom = atomWithQuery("search");
export const lessonAtom = atomWithQuery("lesson");

export default function Explore() {
  const searchBox = useRef<HTMLInputElement>(null);

  // current topic
  const [topicId, setTopicId] = useAtom(topicAtom);

  // current search
  const [search, setSearch] = useAtom(searchAtom);

  // current lesson
  const [lessonId, setLessonId] = useAtom(lessonAtom);

  // current topic details
  const topic = topics.find((topic) => topic.id === topicId);

  // search results
  let results = useFuzzySearch(
    topics.find((topic) => topic.id === topicId)?.lessons ?? byDate,
    search,
  );

  // show all or truncate results
  const [all, setAll] = useState(false);
  if (!all) results = results.slice(0, limit);

  // scroll to search box
  const scroll = () => {
    searchBox.current?.scrollIntoView();
    searchBox.current?.focus();
  };

  return (
    <section>
      <Heading level={2}>
        <hr />
        Explore
        <hr />
      </Heading>

      <Textbox
        ref={searchBox}
        icon={<MagnifyingGlassIcon />}
        value={search}
        onChange={setSearch}
        className="mb-4 text-lg"
        placeholder="Search..."
        aria-controls="results"
      />

      {/* topic cards */}
      {!topicId?.trim() && !search.trim() ? (
        <div
          id="results"
          className="
            grid grid-cols-3 gap-8
            max-md:grid-cols-2
            max-sm:grid-cols-1
          "
        >
          {topics.map(({ id, title, img }, index) => (
            <button
              key={index}
              className="card-button"
              onClick={() => {
                setTopicId(id);
                scroll();
              }}
            >
              <img src={img ?? ""} alt="" />
              <div>{title}</div>
            </button>
          ))}
        </div> //
      ) : results.length ? (
        <>
          {/* selected topic */}
          {topic && (
            <div
              className="
                flex items-center gap-8
                max-md:flex-col
              "
            >
              <img src={topic.img ?? ""} alt="" className="aspect-video h-30" />
              <div className="flex grow flex-col gap-2">
                <div className="w-max shrink-0 font-sans text-lg font-medium">
                  {topic.title}
                </div>
                <div>{topic.description}</div>
              </div>
              <Button
                onClick={async () => setTopicId("")}
                aria-label="Clear topic"
              >
                <XIcon />
              </Button>
            </div>
          )}

          {/* search results */}
          <div
            id="results"
            className="
              grid grid-cols-3 gap-8
              max-md:grid-cols-2
              max-sm:grid-cols-1
            "
          >
            {results.map(({ id, title, description, video }, index) => (
              <button
                key={index}
                className="card-button"
                onClick={() => {
                  setLessonId(id);
                  play();
                }}
              >
                <img
                  src={getThumbnail(video)}
                  alt=""
                  className={clsx(lessonId === id && "opacity-50")}
                />

                <div>{title}</div>
                <div>{description}</div>
                {lessonId === id && (
                  <div
                    className="
                      absolute -top-4 -right-4 grid size-8 place-items-center
                      rounded-full bg-theme text-white
                    "
                  >
                    <EyeIcon />
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* expand/collapse results */}
          {results.length >= limit && (
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
