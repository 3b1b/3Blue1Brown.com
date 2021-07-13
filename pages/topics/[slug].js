import NormalLayout from "../../layouts/NormalLayout";
import Section from "../../components/Section";
import TopicHeader from "../../components/TopicHeader";
import LessonCard from "../../components/LessonCard";
import topics from "../../data/topics.yaml";
import { lessonMeta } from "../../util/pages";
import Clickable from "../../components/Clickable";

export default function Topic({ topic }) {
  return (
    <NormalLayout>
      <TopicHeader topic={topic} />
      <Section width="narrow">
        <div style={{ textAlign: "left" }}>
          <Clickable
            link="/#lessons"
            text="Lessons"
            icon="fas fa-arrow-left"
            style={{ margin: 0 }}
          />
        </div>

        <div style={{ margin: "20px -20px" }}>
          {topic.lessons.map((slug) => (
            <LessonCard key={slug} id={slug} />
          ))}
        </div>
      </Section>
    </NormalLayout>
  );
}

export async function getStaticPaths() {
  const paths = topics.map((topic) => `/topics/${topic.slug}`);
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const topic = topics.find((topic) => topic.slug === params.slug);

  return {
    props: {
      topic,
      lessons: lessonMeta,
    },
  };
}
