import Card from "~/components/Card";
import { H2, H3 } from "~/components/Heading";
import Link from "~/components/Link";
import { getThumbnail, getWatch } from "~/components/YouTube";
import { episodes, logo, platforms } from "~/pages/podcast/podcast";

// extras page podcast section
export default function Podcast() {
  return (
    <section className="bg-alt-white">
      <H2>Podcast</H2>

      <div className="flex items-center gap-8 max-md:flex-col">
        <div className="flex w-40 shrink-0 flex-col gap-8">
          <img src={logo} alt="The 3Blue1Brown Podcast" />

          <div className="flex flex-wrap justify-center gap-4">
            <Platforms />
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <p>
            AI has upended the world of mathematics, and the changes are
            happening at a rapid pace. It's making many people step back and
            reflect on what math means to them. What's valuable about it? What's
            worth keeping? What's worth leaving behind?
          </p>

          <p>
            To explore these questions, I've relaunched the 3b1b Podcast, where
            I'm having conversations with some of math's most thoughtful minds
            about where they see themselves in a world where AI is only getting
            better.
          </p>
        </div>
      </div>

      <H3>Episodes</H3>

      <div className="grid grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
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

export function Platforms() {
  return platforms.map(({ name, link, image }) => (
    <Link
      to={link}
      key={name}
      arrow={false}
      className="size-8 transition hocus:grayscale"
      title={`Listen via ${name}`}
      aria-label={`Listen via ${name}`}
    >
      <img src={image} alt="" />
    </Link>
  ));
}
