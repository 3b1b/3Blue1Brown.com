import type { MDXContent } from "mdx/types";
import { orderBy, sample } from "lodash-es";
import { renderText } from "~/util/dom";
import { importAssets } from "~/util/import";
import { getThumbnail } from "~/util/youtube";

type LessonFrontmatter = {
  id?: string;
  title?: string;
  date?: Date;
  description?: string;
  credits?: string[];
  video?: string;
  source?: string;
  chapter?: number;
  image?: string;
};

type Lesson = {
  default: MDXContent;
  frontmatter: LessonFrontmatter;
};

// import all lesson custom thumbnails
const [getCustomThumbnail] = importAssets(
  import.meta.glob<{ default: string }>("./20\\d\\d/**/thumbnail.*.{jpg}", {
    eager: true,
  }),
  "thumbnail",
);

// import all lessons
export const [getLesson, lessons] = importAssets(
  import.meta.glob<Lesson>("./20\\d\\d/**/index.mdx", { eager: true }),
  "index",
  // derive extra details
  (lesson, id) => ({
    ...lesson,
    frontmatter: {
      ...lesson.frontmatter,
      id,
      // parse date
      date: new Date(lesson.frontmatter.date ?? ""),
      // lookup thumbnail
      image:
        getThumbnail(lesson.frontmatter.video ?? "") ||
        getCustomThumbnail(id)?.default ||
        "",
      // combine credits by role for more compact display
      combinedCredits: lesson.frontmatter.credits?.reduce(
        (credits, credit) => {
          const [, role = "", name = ""] = credit.match(/(.*) by (.*)/) ?? [];
          credits[role] ??= [];
          credits[role].push(name);
          return credits;
        },
        {} as Record<string, string[]>,
      ),
    },
  }),
);

// import all lesson patrons
export const [getPatrons, patrons] = importAssets(
  import.meta.glob<{ default: string }>("./20\\d\\d/**/patrons.txt", {
    eager: true,
    query: "raw",
  }),
  "patrons",
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

// get previous lesson relative to this one by date
export const getPreviousByDate = (id: string) => {
  let index = byDate.indexOf(id);
  if (index === -1) return;
  for (; index < byDate.length; index++) {
    const previous = byDate[index + 1];
    if (!previous) continue;
    const lesson = getLesson(previous);
    if (lesson) return lesson;
  }
};

// get next lesson relative to this one by date
export const getNextByDate = (id: string) => {
  let index = byDate.indexOf(id);
  if (index === -1) return;
  for (; index > 0; index--) {
    const next = byDate[index - 1];
    if (!next) continue;
    const lesson = getLesson(next);
    if (lesson) return lesson;
  }
};

// check if lesson has text content
export const hasContent = (id: string) =>
  !!renderText(getLesson(id)?.default?.({}));
