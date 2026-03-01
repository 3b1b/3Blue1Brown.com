import { mapValues } from "lodash-es";
import _topics from "~/data/topics.json";
import { byDate, getLesson } from "~/pages/lessons/lessons";
import { importAssets } from "~/util/import";

// get topic image
const [getImage] = importAssets(
  import.meta.glob<{ default: string }>("./topics/*.svg", { eager: true }),
);

// extra/special "topics"
const specialTopics = {
  "best-of": {
    title: "Best Of",
    description: "A few hand-picked favorites",
    lessons: [
      "fourier-series",
      "hardest-problem",
      "colliding-blocks-v2",
      "wordle",
      "essence-of-calculus",
      "prime-spirals",
      "windmills",
      "zeta",
      "cosmic-distance-1",
      "fractal-dimension",
      "shadows",
      "newtons-fractal",
    ],
  },
  all: {
    title: "All",
    description: "All lessons, newest to oldest",
    lessons: byDate,
  },
};

// combine special topics with regular topics
export const topics = mapValues(
  { ...specialTopics, ..._topics },
  (topic, id) => ({
    id,
    image: getImage(id)?.default ?? "",
    ...topic,
  }),
);

export type TopicId = keyof typeof topics;

// get topic that lesson is in
export const getTopic = (id: string) => {
  for (const [topicId, topic] of Object.entries(topics))
    if (topicId in specialTopics && topic.lessons.includes(id)) return topic;
};

// get previous lesson relative to this one by topic
export const getPreviousByTopic = (id: string) => {
  const topic = getTopic(id);
  if (!topic) return;
  const index = topic.lessons.indexOf(id);
  if (index === -1) return;
  const previous = topic.lessons[index - 1];
  if (!previous) return;
  return getLesson(previous);
};

// get next lesson relative to this one by topic
export const getNextByTopic = (id: string) => {
  const topic = getTopic(id);
  if (!topic) return;
  const index = topic.lessons.indexOf(id);
  if (index === -1) return;
  const next = topic.lessons[index + 1];
  if (!next) return;
  return getLesson(next);
};
