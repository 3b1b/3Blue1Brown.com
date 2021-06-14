import { useContext, useState } from "react";
import Section from "../Section";
import LessonCard from "../LessonCard";
import Clickable from "../Clickable";
import topics from "../../data/topics.yaml";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";

const LessonNav = () => {
  const [open, setOpen] = useState(false);
  const { topic: topicName, slug } = useContext(PageContext);

  // find topic in yaml data whose name matches topic of current lesson
  const topic = topics.find(({ name }) => name === topicName);
  if (!topic) return <></>;

  // get previous and next lessons
  const index = topic.lessons.findIndex((lesson) => lesson === slug);
  const prev = topic.lessons[index - 1];
  const next = topic.lessons[index + 1];

  return (
    <Section>
      <div className={styles.lesson_nav}>
        <div className={styles.controls}>
          <LessonCard
            id={prev}
            mini={true}
            icon="fas fa-arrow-left"
            tooltip="Previous lesson"
            className={styles.prev}
          />
          <Clickable
            icon={open ? "fas fa-times" : "fas fa-bars"}
            className={styles.toggle}
            onClick={() => setOpen(!open)}
            tooltip={
              open ? "Close list" : "See more lessons for topic " + topicName
            }
          />
          <LessonCard
            id={next}
            mini={true}
            reverse={true}
            icon="fas fa-arrow-right"
            tooltip="Next lesson"
            className={styles.next}
          />
        </div>
        {open && (
          <div className={styles.list}>
            {topic.lessons.map((lesson, index) => (
              <LessonCard key={index} id={lesson} mini={true} />
            ))}
          </div>
        )}
      </div>
    </Section>
  );
};

export default LessonNav;
