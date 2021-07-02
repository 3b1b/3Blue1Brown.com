import { useContext, useMemo, useState } from "react";
import Link from "next/link";
import Center from "../Center";
import Clickable from "../Clickable";
import LessonCard from "../LessonCard";
import topics from "../../data/topics.yaml";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";
import PiCreature from "../PiCreature";

// gallery that shows all lessons in various ways with tabs. show by topic or all
const LessonGallery = ({ show = "topic" }) => {
  const { lessons } = useContext(PageContext);
  const [tab, setTab] = useState(show); // active tab

  const [searchText, setSearchText] = useState("");

  const view = searchText ? "search" : tab;

  const filteredLessons = useMemo(() => {
    if (view !== "search") {
      // No need to filter
      return lessons;
    }

    return lessons.filter((lesson) => matchesSearch(lesson, searchText));
  }, [lessons, view, searchText]);

  const googleURL = new URL("https://google.com/search");
  googleURL.searchParams.append("q", `site:3blue1brown.com ${searchText}`);

  return (
    <>
      <div className={styles.tabs}>
        <Clickable
          text="Topics"
          onClick={() => {
            setTab("topic");
            setSearchText("");
          }}
          active={view === "topic"}
        />
        <Clickable
          text="All"
          onClick={() => {
            setTab("all");
            setSearchText("");
          }}
          active={view === "all"}
        />

        <div className={styles.search} data-active={view === "search"}>
          <i className="fas fa-search" />
          <input
            type="text"
            value={searchText}
            onChange={(event) => {
              setSearchText(event.target.value);
            }}
          />
        </div>
      </div>
      {view === "topic" && (
        <Center>
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </Center>
      )}
      {(view === "all" || view === "search") &&
        filteredLessons.map((lesson) => (
          <LessonCard key={lesson.slug} id={lesson.slug} />
        ))}
      {(view === "all" || view === "search") && filteredLessons.length === 0 && (
        <div className={styles.no_results}>
          <PiCreature
            text="No lessons match your search."
            emotion="maybe"
            placement="inline"
          />
          <p>
            Can't find what you're looking for? Try{" "}
            <a href={googleURL} target="_blank" rel="noreferrer">
              searching Google
            </a>{" "}
            instead.
          </p>
        </div>
      )}
    </>
  );
};

export default LessonGallery;

const TopicCard = ({ topic }) => {
  return (
    <Link href={`/topics/${topic.slug}`}>
      <a className={styles.topic_card}>
        <img
          className={styles.image}
          src={`/images/topics/${topic.slug}.jpg`}
          alt={topic.name}
        />
        <span className={styles.title}>{topic.name}</span>
      </a>
    </Link>
  );
};

function matchesSearch(lesson, searchText) {
  const searchStrings = [
    lesson.title,
    lesson.description,
    lesson.slug,
    lesson.topic,
    lesson.video,
    new Date(lesson.date).toLocaleDateString(undefined, {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    }),
  ];

  return searchStrings
    .join("\n")
    .toLowerCase()
    .includes(searchText.toLowerCase());
}
