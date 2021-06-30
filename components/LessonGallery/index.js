import { useContext, useState } from "react";
import Link from "next/link";
import Center from "../Center";
import Clickable from "../Clickable";
import LessonCard from "../LessonCard";
import featured from "../../data/featured.yaml";
import topics from "../../data/topics.yaml";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";

// gallery that shows all lessons in various ways with tabs. show by featured,
// topic, or date
const LessonGallery = ({ show = "topic" }) => {
  const { lessons } = useContext(PageContext);
  const [tab, setTab] = useState(show); // active tab

  return (
    <>
      <Center>
        <Clickable
          text="Featured"
          onClick={() => setTab("featured")}
          active={tab === "featured"}
        />
        <Clickable
          text="By Topic"
          onClick={() => setTab("topic")}
          active={tab === "topic"}
        />
        <Clickable
          text="By Date"
          onClick={() => setTab("date")}
          active={tab === "date"}
        />
      </Center>
      {tab === "featured" &&
        featured
          .map((slug) => lessons.find((lesson) => lesson.slug === slug))
          .filter((lesson) => lesson)
          .map((lesson, index) => <LessonCard key={index} id={lesson.slug} />)}
      {tab === "topic" && (
        <Center>
          {topics.map((topic, index) => (
            <TopicCard key={index} topic={topic} />
          ))}
        </Center>
      )}
      {tab === "date" &&
        lessons.map((lesson, index) => (
          <LessonCard key={index} id={lesson.slug} />
        ))}
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
