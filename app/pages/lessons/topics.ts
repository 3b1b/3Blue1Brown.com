import { mapValues, omit } from "lodash-es";
import _topics from "~/data/topics.json";
import { byDate } from "~/pages/lessons/lessons";
import { importAssets } from "~/util/import";

// get topic image
const [getImage] = importAssets(
  import.meta.glob<{ default: string }>("./topics/*.svg", { eager: true }),
  undefined,
  (module) => module.default,
);

// topics that don't count as "real" topics e.g. for prev/next nav
const specialTopics = ["all", "best-of"];

// list of topics
export const topics = mapValues(
  {
    all: {
      title: "All",
      description: "All lessons, newest to oldest",
      lessons: byDate,
    },
    ...omit(_topics, "miscellaneous"),
  },
  // derive extras
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
    if (!specialTopics.includes(topicId) && topic.lessons.includes(id))
      return topic;
};
