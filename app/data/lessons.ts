import { orderBy } from "lodash-es";
import _lessons from "./lessons.yaml";

// lesson data w/ type defs
export const lessons = _lessons as Topic[];

type Topic = {
  id: string;
  title: string;
  description: string;
  lessons: Lesson[];
};

type Lesson = {
  id: string;
  year: string;
  title: string;
  description: string;
  date: Date;
  video: string;
  thumbnail: string;
  credits: string[];
  source: string;
};

// get lessons ordered by date, most recent first
export const byDate = orderBy(
  lessons.flatMap(({ lessons, ...topic }) =>
    lessons.map((lesson) => ({ ...lesson, topic })),
  ),
  (lesson) => lesson?.date,
  "desc",
);

// get next lesson relative to this one by date
export const getNextByDate = (id: string) => {
  const index = byDate.findIndex((lesson) => lesson?.id === id);
  if (index === -1) return;
  return byDate[index + 1];
};

// get previous lesson relative to this one by date
export const getPreviousByDate = (id: string) => {
  const index = byDate.findIndex((lesson) => lesson?.id === id);
  if (index === -1) return null;
  return byDate[index - 1];
};

// get lesson by id, plus topic it belongs to and chapter index
export const getLesson = (id: string) => {
  let chapter = -1;
  let lesson: Lesson | undefined;
  const topic = lessons.find(({ lessons }) => {
    chapter = lessons.findIndex((lesson) => lesson.id === id);
    if (chapter === -1) return false;
    lesson = lessons[chapter];
    return true;
  });
  return { lesson, topic, chapter };
};

// get latest lesson
export const getLatest = () => byDate[0];

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
