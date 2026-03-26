import Card from "~/components/Card";
import { H2 } from "~/components/Heading";
import { importAssets } from "~/util/import";

// get work image
const [getImage] = importAssets(
  import.meta.glob<{ default: string }>("./images/*.jpg", {
    eager: true,
    // limit size, compress
    query: "w=600&format=webp",
  }),
  undefined,
  (module) => module.default,
);

const entries = [
  {
    name: "Manim",
    description: "An open source library for programmatic animations",
    link: "https://github.com/3b1b/manim",
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
  image: getImage(entry.name) ?? "",
}));

// misc links
export default function Other() {
  return (
    <section>
      <H2 className="sr-only">Other</H2>
      <div className="grid grid-cols-3 gap-8 max-md:grid-cols-2 max-sm:grid-cols-1">
        {entries.map(({ link, name, description, image }, index) => (
          <Card
            key={index}
            to={link}
            image={image}
            title={name}
            description={description}
          />
        ))}
      </div>
    </section>
  );
}
