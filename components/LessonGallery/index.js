import { useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import Center from "../Center";
import Clickable from "../Clickable";
import LessonCard from "../LessonCard";
import topics from "../../data/topics.yaml";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";
import PiCreature from "../PiCreature";
import { transformSrc } from "../../util/transformSrc";

LessonGallery.propTypes = {
  show: PropTypes.oneOf(["topic", "all", "written"]),
};

// gallery that shows all lessons in various ways with tabs. show by topic or all
export default function LessonGallery({ show = "topic" }) {
  const { lessons } = useContext(PageContext);
  const topic_names = topics.map((topic) => topic.name);
  const sorted_lessons = [...lessons].sort((a, b) => {
    const ati = topic_names.indexOf(a.topic);
    const bti = topic_names.indexOf(b.topic);
    if (ati === -1) return 1;
    if (bti === -1) return -1;
    if (ati == bti) {
      return (
        topics[ati].lessons.indexOf(a.slug) -
        topics[bti].lessons.indexOf(b.slug)
      );
    }
    return ati - bti;
  });

  const [tab, setTab] = useState(show); // active tab

  const [searchText, setSearchText] = useState("");

  const view = searchText ? "search" : tab;

  const filteredLessons = useMemo(() => {
    if (view === "written") {
      return sorted_lessons.filter((lesson) => !lesson.empty);
    }
    if (view === "search") {
      return sorted_lessons.filter((lesson) =>
        matchesSearch(lesson, searchText)
      );
    }
    // Otherwise, return all by date
    return lessons;
  }, [lessons, view, searchText]);

  return (
    <div>
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
          text="By date"
          onClick={() => {
            setTab("all");
            setSearchText("");
          }}
          active={view === "all"}
        />
        <Clickable
          text="Written"
          onClick={() => {
            setTab("written");
            setSearchText("");
          }}
          active={view === "written"}
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
        <div className={styles.topicGrid}>
          {topics.map((topic) => (
            <TopicCard key={topic.slug} topic={topic} />
          ))}
        </div>
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
        </div>
      )}
      {view === "written" &&
        filteredLessons.map((lesson) => (
          <LessonCard key={lesson.slug} id={lesson.slug} />
        ))}
    </div>
  );
}

const TopicCard = ({ topic }) => {
  return (
    <Link href={`/topics/${topic.slug}`}>
      <a className={styles.topic_card}>
        <img
          className={styles.image}
          src={transformSrc(`/images/topics/${topic.slug}.jpg`)}
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
