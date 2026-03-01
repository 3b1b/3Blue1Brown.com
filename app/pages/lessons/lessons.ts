import type { MDXContent } from "mdx/types";
import { orderBy, sample } from "lodash-es";
import { renderText } from "~/util/dom";
import { importAssets } from "~/util/import";

type LessonFrontmatter = {
  id?: string;
  title?: string;
  date?: Date;
  description?: string;
  credits?: string[];
  video?: string;
  source?: string;
};

type Lesson = {
  default: MDXContent;
  frontmatter: LessonFrontmatter;
};

// import all lessons
export const [getLesson, lessons] = importAssets(
  import.meta.glob<Lesson>("./2015/**/index.mdx", { eager: true }),
  "index",
  // derive extra details
  (id, path, lesson) => ({
    ...lesson,
    frontmatter: {
      ...lesson.frontmatter,
      id,
      date: new Date(lesson.frontmatter.date ?? ""),
    },
  }),
);

// get lessons ordered by date, most recent first
export const byDate = orderBy(
  Object.entries(lessons),
  ([, lesson]) => lesson?.frontmatter?.date,
  "desc",
).map(([id]) => id);

// get random lesson
export const getRandom = () => getLesson(sample(byDate)!);

// get latest lesson
export const getLatest = () => getLesson(byDate[0]!);

// get next lesson relative to this one by date
export const getNextByDate = (id: string) => {
  const index = byDate.indexOf(id);
  if (index === -1) return;
  const next = byDate[index - 1];
  if (!next) return;
  return getLesson(next);
};

// get previous lesson relative to this one by date
export const getPreviousByDate = (id: string) => {
  const index = byDate.indexOf(id);
  if (index === -1) return null;
  const previous = byDate[index + 1];
  if (!previous) return null;
  return getLesson(previous);
};

// check if lesson has text content
export const hasText = (id: string) =>
  !!renderText(getLesson(id)?.default?.({}));
