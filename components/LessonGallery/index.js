import { useContext, useState } from "react";
import Link from "next/link";
import Center from "../Center";
import Clickable from "../Clickable";
import LessonCard from "../LessonCard";
import topics from "../../data/topics.yaml";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";

// gallery that shows all lessons in various ways with tabs. show by featured,
// topic, or all
const LessonGallery = ({ show = "topic" }) => {
  const { lessons } = useContext(PageContext);
  const [tab, setTab] = useState(show); // active tab

  return (
    <>
      <Center>
        <Clickable
          text="Topics"
          onClick={() => setTab("topic")}
          active={tab === "topic"}
        />
        <Clickable
          text="All"
          onClick={() => setTab("all")}
          active={tab === "all"}
        />
      </Center>
      {tab === "topic" && (
        <Center>
          {topics.map((topic, index) => (
            <TopicCard key={index} topic={topic} />
          ))}
        </Center>
      )}
      {tab === "all" &&
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
