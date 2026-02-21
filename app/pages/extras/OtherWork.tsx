import Link from "~/components/Link";
import { importAssets } from "~/util/file";

const { lookUp } = importAssets(
  import.meta.glob("./images/*.{jpg,png}", {
    eager: true,
    // limit size, compress
    query: "w=600&format=webp",
  }),
);

const entries = [
  {
    name: "Manim",
    description: "An open source library for programmatic animations",
    link: "https://github.com/3b1b/manim",
  },
  {
    name: "3b1b Podcast",
    description: "A dormant podcast, perhaps to be spun up again one day",
    link: "https://www.youtube.com/playlist?list=PLfx0NKbQXfNBc5n8LOXYRTMzvTofAY8d6",
  },
  {
    name: "Collaborations",
    description: "Collaborations and cameos on YouTube",
    link: "https://www.youtube.com/playlist?list=PLZHQObOWTQDMhxE4XbNHLlJ56E2TGBZ0_",
  },
  {
    name: "Khan Academy",
    description: "Multivariable calculus videos and article on Khan Academy",
    link: "https://www.khanacademy.org/math/multivariable-calculus/",
  },
  {
    name: "MIT",
    description: "18.S191: Introduction to Computational Thinking with Julia",
    link: "https://ocw.mit.edu/courses/mathematics/18-s191-introduction-to-computational-thinking-fall-2020/index.htm",
  },
  {
    name: "Ben, Ben and Blue",
    description:
      "Conversations with three friends about education and content creation",
    link: "https://www.youtube.com/@BenBenandBlue/videos",
  },
  {
    name: "TEDx Talk",
    description: "What Makes People Engage With Math",
    link: "https://www.ted.com/talks/grant_sanderson_what_makes_people_engage_with_math",
  },
  {
    name: "Quanta",
    description: "Contributor to Quanta Magazine",
    link: "https://www.quantamagazine.org/authors/sandserson_grant/",
  },
  {
    name: "Quaternions",
    description: "An experiment with a more immersive video experience",
    link: "https://eater.net/quaternions",
  },
].map((entry) => ({
  ...entry,
  image: lookUp(entry.name),
}));

export default function OtherWork() {
  return (
    <>
      <section>
        <div className="grid grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
          {entries.map(({ link, name, description, image }, index) => (
            <Link key={index} className="card" to={link} arrow={false}>
              <img src={image} alt="" />
              <div className="font-sans font-medium">{name}</div>
              <div>{description}</div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
