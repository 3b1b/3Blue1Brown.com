import { mapValues, omit } from "lodash-es";
import _topics from "~/data/topics.json";
import { byDate, getNext, getPrevious } from "~/pages/lessons/lessons";
import { importAssets } from "~/util/import";

// get topic image
const [getImage] = importAssets(
  import.meta.glob<{ default: string }>("./topics/*.svg", { eager: true }),
  undefined,
  (module) => module.default,
);

// extra/special "topics"
const specialTopics = {
  "best-of": {
    title: "Best Of",
    description: "A few hand-picked favorites",
    lessons: [
      "newtons-fractal",
      "shadows",
      "fractal-dimension",
      "cosmic-distance-1",
      "zeta",
      "windmills",
      "prime-spirals",
      "essence-of-calculus",
      "wordle",
      "colliding-blocks-v2",
      "hardest-problem",
      "fourier-series",
      "print-gallery",
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
  { ...specialTopics, ...omit(_topics, "miscellaneous") },
  (topic, id) => ({
    id,
    image: getImage(id) ?? "",
    ...topic,
  }),
);

export type TopicId = keyof typeof topics;

// get topic that lesson is in
export const getTopic = (id: string) => {
  for (const [topicId, topic] of Object.entries(topics))
    if (!(topicId in specialTopics) && topic.lessons.includes(id)) return topic;
};

// get previous lesson relative to this one by topic
export const getPreviousByTopic = (id: string) => {
  const topic = getTopic(id);
  if (!topic) return;
  return getPrevious(id, topic.lessons);
};

// get next lesson relative to this one by topic
export const getNextByTopic = (id: string) => {
  const topic = getTopic(id);
  if (!topic) return;
  return getNext(id, topic.lessons);
};
