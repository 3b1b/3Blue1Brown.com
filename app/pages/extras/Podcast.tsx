import Card from "~/components/Card";
import { H2, H3 } from "~/components/Heading";
import Link from "~/components/Link";
import podcast from "~/pages/podcast/images/3b1b-podcast.svg";
import { importAssets } from "~/util/import";
import { getThumbnail, getWatch } from "~/util/youtube";

const [getLogo] = importAssets(
  import.meta.glob<{ default: string }>("~/pages/podcast/images/*.png", {
    eager: true,
  }),
);

const platforms = [
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
  image: getLogo(platform.name)?.default ?? "",
}));

const episodes = [
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

export default function Podcast() {
  return (
    <section className="bg-off-white">
      <H2>Podcast</H2>

      <div className="grid grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
        <img
          src={podcast}
          alt="The 3Blue1Brown Podcast"
          className="max-md:col-span-full max-md:max-h-50 max-md:justify-self-center"
        />

        <div className="col-span-2 flex flex-col gap-8 max-md:col-span-full">
          <p>
            During the summer of 2021, I experimented with a little podcast,
            centered around interviewing mathematicians and online educational
            creators. As it stands, only five episodes have been published, and
            the project is dormant. Pending demand, I may spin it up again in
            the future, but for the time being please enjoy these five extended
            conversations.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 *:size-8">
            {platforms.map(({ name, link, image }) => (
              <Link
                to={link}
                key={name}
                arrow={false}
                className="transition hocus:grayscale"
                title={`Listen via ${name}`}
                aria-label={`Listen via ${name}`}
              >
                <img src={image} alt="" />
              </Link>
            ))}
          </div>
        </div>

        <hr className="col-span-full" />

        <H3 className="sr-only">Episodes</H3>

        {episodes.map(({ title, video }, index) => (
          <Card
            key={index}
            to={getWatch(video)}
            image={getThumbnail(video)}
            title={title}
          />
        ))}
      </div>
    </section>
  );
}
