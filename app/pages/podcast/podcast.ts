import { importAssets } from "~/util/import";

// podcast logo
export { default as logo } from "./images/3b1b-podcast.png";

// import platform logos
const [getLogo] = importAssets(
  import.meta.glob<{ default: string }>("./images/*.png", { eager: true }),
  undefined,
  (module) => module.default,
);

// listening platforms
export const platforms = [
  {
    name: "YouTube",
    link: "https://www.youtube.com/playlist?list=PLfx0NKbQXfNBc5n8LOXYRTMzvTofAY8d6",
  },
  {
    name: "Apple Podcasts",
    link: "https://podcasts.apple.com/us/podcast/the-3b1b-podcast/id1576951213",
  },
  {
    name: "Spotify",
    link: "https://open.spotify.com/show/74ZzyhJx8NL5OBmv2RWXnB",
  },
  {
    name: "Player FM",
    link: "https://player.fm/series/the-3b1b-podcast",
  },
  {
    name: "Pocket Casts",
    link: "https://pocketcasts.com/podcast/the-3b1b-podcast/13181ee0-c368-0139-2970-0acc26574db2",
  },
  {
    name: "RSS",
    link: "https://anchor.fm/s/636b4820/podcast/rss",
  },
].map((platform) => ({
  ...platform,
  image: getLogo(platform.name) ?? "",
}));

// episodes, most recent first
export const episodes = [
  {
    title: "Jordan Ellenberg: Being Dispensable",
    description:
      "Jordan Ellenberg joins the podcast for a conversation about what AI-generated proofs mean for the people who do mathematics.",
    video: "s_lGhOD8uN4",
  },
  {
    title: "Steven Strogatz: The humanity of math",
    description:
      "Steven Strogatz returns to discuss what AI means for the future of mathematics, and why human understanding still matters.",
    video: "xUSznTR2cwc",
  },
  {
    title: "Tai-Danae Bradley: Where math meets language",
    description:
      "Tai-Danae Bradley does research applying tools from physics to understanding language models, all under the broader umbrella of category theory.",
    video: "pvRY3r-b0QI",
  },
  {
    title: "Dianna Cowern: From MIT to Physics Girl",
    description:
      "Dianna Cowern is the host of the YouTube channel Physics Girl.",
    video: "puXKFn-nKis",
  },
  {
    title: "Steven Strogatz: In and out of love with math",
    description:
      "Steven Strogatz, an applied mathematician at Cornell, is a prominent figure in the field of nonlinear dynamics and chaos and a widely beloved popularizer of math.",
    video: "SUMLKweFAYk",
  },
  {
    title: "Sal Khan: Beyond Khan Academy",
    description:
      "In this conversation with Sal Khan, we discuss his new project (Schoolhouse.world) as well as the Khan Lab School that he started in 2014.",
    video: "SAhKohb5e_w",
  },
  {
    title: "Alex Kontorovich: Improving math",
    description:
      "Alex Kontorovich is a research mathematician at Rutgers University, a distinguished visiting professor at the MoMath Museum, and Editor-in-Chief of Experimental Mathematics, among other things.",
    video: "C-i4q-Xlnis",
  },
];
