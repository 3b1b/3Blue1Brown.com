import { useContext, useMemo, useState } from "react";
import PropTypes from "prop-types";
import Center from "../Center";
import Clickable from "../Clickable";
import LessonCard from "../LessonCard";
import topics from "../../data/topics.yaml";
import { topic_suggestion_form } from "../../data/site.yaml";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";
import PiCreature from "../PiCreature";
import { transformSrc } from "../../util/transformSrc";

LessonGallery.propTypes = {
  show: PropTypes.oneOf(["topic", "all", "written"]),
  skipMostRecent: PropTypes.bool,
};

// gallery that shows all lessons in various ways with tabs. show by topic or all
export default function LessonGallery({ show = "topic", skipMostRecent = false }) {
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
  
  const [selectedTopic, setSelectedTopic] = useState(null); // selected topic for filtering

  const view = searchText ? "search" : selectedTopic ? "topic-lessons" : tab;

  const filteredLessons = useMemo(() => {
    if (view === "written") {
      return sorted_lessons.filter((lesson) => !lesson.empty);
    }
    if (view === "search") {
      return sorted_lessons.filter((lesson) =>
        matchesSearch(lesson, searchText)
      );
    }
    if (view === "topic-lessons") {
      return sorted_lessons.filter((lesson) => lesson.topic === selectedTopic);
    }
    // Otherwise, return all by date
    let lessonsByDate = lessons;
    if (skipMostRecent && view === "all") {
      lessonsByDate = lessons.slice(1); // Skip the first (most recent) lesson
    }
    return lessonsByDate;
  }, [lessons, view, searchText, selectedTopic, skipMostRecent]);

  return (
    <div>
      <div className={styles.search} data-active={view === "search"}>
        <i className="fas fa-search" />
        <input
          type="text"
          placeholder="Search lessons"
          value={searchText}
          onChange={(event) => {
            setSearchText(event.target.value);
          }}
        />
      </div>
      <div className={styles.tabs}>
        <Clickable
          text="Topics"
          design="tab"
          onClick={() => {
            setTab("topic");
            setSearchText("");
            setSelectedTopic(null);
          }}
          active={view === "topic"}
        />
        <Clickable
          text="By date"
          design="tab"
          onClick={() => {
            setTab("all");
            setSearchText("");
            setSelectedTopic(null);
          }}
          active={view === "all"}
        />
        <Clickable
          text="Written"
          design="tab"
          onClick={() => {
            setTab("written");
            setSearchText("");
            setSelectedTopic(null);
          }}
          active={view === "written"}
        />
      </div>
      {view === "topic" && (
        <div className={styles.topicGrid}>
          {topics.map((topic) => (
            (topic.slug != "miscellaneous") &&
            <TopicCard 
              key={topic.slug} 
              topic={topic} 
              onTopicClick={setSelectedTopic} 
            />
          ))}
        </div>
      )}
      {(view === "all" || view === "search" || view === "topic-lessons") &&
        filteredLessons.map((lesson) => (
          <LessonCard key={lesson.slug} id={lesson.slug} />
        ))}
      {(view === "all" || view === "search" || view === "topic-lessons") && filteredLessons.length === 0 && (
        <div className={styles.no_results}>
          <PiCreature
            text="No lessons match your search."
            emotion="shruggie"
            placement="inline"
            design="big"
            flip={true}
            dark={true}
          />
          <Center>
            <Clickable
              link={topic_suggestion_form}
              icon="fa-solid fa-align-justify"
              text="Suggest a topic"
              design="rounded"
              style={{ width: '200px' }}
            />
          </Center>
        </div>
      )}
      {view === "written" &&
        filteredLessons.map((lesson) => (
          <LessonCard key={lesson.slug} id={lesson.slug} />
        ))}
    </div>
  );
}

const TopicCard = ({ topic, onTopicClick }) => {
  return (
    <div 
      className={styles.topic_card} 
      data-title={topic.name}
      onClick={() => onTopicClick(topic.name)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          onTopicClick(topic.name);
        }
      }}
    >
      <div className={styles.imageContainer}>
        <img
          className={styles.image}
          src={transformSrc(`/images/topics/${topic.slug}.svg`)}
          alt={topic.name}
        />
        <div className={styles.gradientOverlay}></div>
        <span className={styles.overlayTitle}>{topic.name}</span>
      </div>
    </div>
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
