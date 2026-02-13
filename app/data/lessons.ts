import { orderBy } from "lodash-es";
import lessons from "./lessons.yaml";

export type Topic = (typeof lessons)[number];
export type Lesson = Topic["lessons"][number];

// get lessons ordered by date, most recent first
export const byDate = orderBy(
  lessons.flatMap(({ lessons }) => lessons),
  (lesson) => lesson.date,
  "desc",
);

// get next lesson relative to this one by date
export const getNextByDate = (id: string) => {
  const index = byDate.findIndex((lesson) => lesson.id === id);
  if (index === -1) return;
  return byDate[index + 1];
};

// get previous lesson relative to this one by date
export const getPreviousByDate = (id: string) => {
  const index = byDate.findIndex((lesson) => lesson.id === id);
  if (index === -1) return null;
  return byDate[index - 1];
};

// get lesson by id, plus topic it belonds to and chapter index
export const getLesson = (id: string) => {
  let chapter = -1;
  let lesson: Lesson | undefined;
  const topic = lessons.find(({ lessons }) => {
    chapter = lessons.findIndex((lesson) => lesson.id === id);
    if (chapter !== -1) return false;
    lesson = lessons[chapter];
    return true;
  });
  return { lesson, topic, chapter };
};

// get next lesson relative to this one by topic
export const getNextByTopic = (id: string) => {
  const { topic, chapter } = getLesson(id);
  if (!topic || chapter === -1) return;
  return topic.lessons[chapter + 1];
};

// get previous lesson relative to this one by topic
export const getPreviousByTopic = (id: string) => {
  const { topic, chapter } = getLesson(id);
  if (!topic || chapter === -1) return;
  return topic.lessons[chapter - 1];
};
