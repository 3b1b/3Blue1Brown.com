import type { MDXContent } from "mdx/types";
import { orderBy, sample } from "lodash-es";
import { getThumbnail } from "~/components/YouTube";
import { importAssets } from "~/util/import";

export type LessonFrontmatter = {
  id?: string;
  title?: string;
  date?: Date;
  description?: string;
  credits?: string[];
  video?: string;
  source?: string;
  chapter?: number;
  image?: string;
  thumbnail?: string;
  combinedCredits?: Record<string, string[]>;
  read?: boolean;
};

export type Lesson = {
  default: MDXContent;
  frontmatter: LessonFrontmatter;
};

// transform lesson props, derive extras
export const transformLesson = (lesson: Lesson, id: string) => ({
  ...lesson,
  frontmatter: {
    ...lesson.frontmatter,
    id,
    // parse date
    date: new Date(lesson.frontmatter.date ?? ""),
    // lookup thumbnail
    image: lesson.frontmatter.video?.trim()
      ? getThumbnail(lesson.frontmatter.video)
      : (lesson.frontmatter.thumbnail ?? ""),
    // nullify thumbnail field so image field single source of truth
    thumbnail: undefined,
    // combine credits by role for more compact display
    combinedCredits:
      lesson.frontmatter.credits?.reduce(
        (credits, credit) => {
          const [, role = "", name = ""] = credit.match(/(.*) by (.*)/) ?? [];
          credits[role] ??= [];
          credits[role].push(name);
          return credits;
        },
        {} as Record<string, string[]>,
      ) ?? {},
  },
});

// import all lessons (frontmatter only)
export const [getLesson, lessons] = importAssets(
  import.meta.glob<Lesson>("./20\\d\\d/**/index.mdx", {
    eager: true,
    query: "frontmatter-only",
  }),
  "index",
  transformLesson,
);

// import lesson patrons
export const [getPatrons] = importAssets(
  import.meta.glob<{ default: string }>("./20\\d\\d/**/patrons.txt", {
    eager: true,
    query: "raw",
  }),
  "patrons",
  (module) =>
    module.default
      ?.split("\n")
      .map((line) => line.trim())
      .filter(Boolean),
);

// get lessons ordered by date
export const byDate = orderBy(
  Object.entries(lessons),
  ([, lesson]) => lesson?.frontmatter?.date,
  "asc",
).map(([id]) => id);

// get random lesson
export const getRandom = (avoid = "", list = byDate) => {
  const id = sample(list.filter((id) => id !== avoid));
  if (!id) return;
  return getLesson(id);
};

// get first lesson
export const getFirst = (list = byDate) => {
  const id = list.at(0);
  if (!id) return;
  return getLesson(id);
};

// get latest lesson
export const getLast = (list = byDate) => {
  const id = list.at(-1);
  if (!id) return;
  return getLesson(id);
};

// get previous lesson relative to this one in list of lessons
export const getPrevious = (id: string, list = byDate) => {
  // lookup own position in list
  let index = list.indexOf(id);
  if (index === -1) return;
  // go backwards until we find lesson that exists
  for (; index > 0; index--) {
    const previous = list[index - 1];
    if (!previous) continue;
    const lesson = getLesson(previous);
    if (lesson) return lesson;
  }
};

// get next lesson relative to this one in list of lessons
export const getNext = (id: string, list = byDate) => {
  // lookup own position in list
  let index = list.indexOf(id);
  if (index === -1) return;
  // go forwards until we find lesson that exists
  for (; index < list.length - 1; index++) {
    const next = list[index + 1];
    if (!next) continue;
    const lesson = getLesson(next);
    if (lesson) return lesson;
  }
};
