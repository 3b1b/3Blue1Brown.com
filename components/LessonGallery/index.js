import { useContext, useEffect, useState, useRef } from "react";
import Center from "../Center";
import Clickable from "../Clickable";
import LessonCard from "../LessonCard";
import featured from "../../data/featured.yaml";
import topics from "../../data/topics.yaml";
import { PageContext } from "../../pages/_app";
import { toDashCase } from "../../util/string";
import styles from "./index.module.scss";

const LessonGallery = ({ show = "topic" }) => {
  const { lessons } = useContext(PageContext);
  const [tab, setTab] = useState(show);
  const [openedTopic, setOpenedTopic] = useState("");

  // on topic card click
  const onTopicClick = (topic) => {
    if (topic.name === openedTopic) setOpenedTopic("");
    else setOpenedTopic(topic.name);
  };

  // when tab changes, re-close all topic cards
  useEffect(() => {
    setOpenedTopic("");
  }, [tab]);

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
            <TopicCard
              key={index}
              topic={topic}
              opened={openedTopic === topic.name}
              onClick={() => onTopicClick(topic)}
            />
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

const TopicCard = ({ topic, opened, onClick }) => {
  const ref = useRef();

  useEffect(() => {
    if (opened) ref?.current?.scrollIntoView(true);
  }, [opened]);

  return (
    <>
      <button
        ref={ref}
        className={styles.topic_card}
        onClick={onClick}
        data-open={opened}
        data-fade
      >
        <img src={`images/topics/${toDashCase(topic.name)}.jpg`} />
        <span className={styles.text}>
          {topic.name}
          <i className={`fas fa-caret-${opened ? "up" : "down"} fa-lg`} />
        </span>
      </button>
      {opened &&
        topic.lessons.map((lesson, index) => (
          <LessonCard key={index} id={lesson} />
        ))}
    </>
  );
};
