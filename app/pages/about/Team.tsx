import type { ComponentProps } from "react";
import clsx from "clsx";
import { fromPairs, toPairs } from "lodash-es";
import Link from "~/components/Link";
import { slugify } from "~/util/string";

// import all images in sub-folder
const imageImports = import.meta.glob<{ default: string }>(
  "./images/portraits/*.jpg",
  {
    eager: true,
    // limit size, compress
    query: "url&w=600&format=webp",
  },
);

// create map of filename to import url
const imageLookup = fromPairs(
  toPairs(imageImports).map(
    ([path, module]) =>
      [path.split("/").pop()?.split(".")[0] ?? "", module.default] as const,
  ),
);

// lookup image file by name
const getImage = (name: string) => imageLookup[slugify(name)];

type Member = {
  name: string;
  description: string;
  image: string;
  link: string;
};

// add fallbacks and get derived props
const mapMember = ({
  name = "",
  description = "",
  link = "",
}: Partial<Member>) => ({
  name,
  description,
  image: getImage(name),
  link,
});

// main author
export function Grant() {
  return (
    <Portrait
      name="Grant Sanderson"
      image={getImage("Grant Sanderson")}
      description="Creator"
      className="w-50 shrink-0"
    />
  );
}

// current team members
const current = [
  {
    name: "Paul Dancstep",
    description: "Animation, Writing",
    link: "https://www.patreon.com/posts/interview-with-138346173",
  },
  {
    name: "Ashley Hamer Pritchard",
    description: "Head of Operations",
    link: "https://www.linkedin.com/in/ashley-hamer",
  },
  {
    name: "Vincent Rubinetti",
    description: "Music, Web Dev",
    link: "https://vincentrubinetti.com",
  },
].map(mapMember);

// past contributors
const past = [
  {
    name: "James Schloss",
    description: "Running the Summers of Math Exposition",
    link: "https://github.com/leios",
  },
  {
    name: "Quinn Brodsky",
    description: "Filming and research for the Barber pole videos",
    link: "https://wescarroll.com/quinn",
  },
  {
    name: "Dawid Kołodziej",
    description: "Turning long-form videos into shorts",
  },
  {
    name: "Kurt Bruns",
    description:
      "Video artwork, written adaptation of the Calculus series, site management",
    link: "https://kurtbruns.com",
  },
  {
    name: "Josh Pullen",
    description: "2021 Intern, written and interactive adaptations of videos",
    link: "https://www.joshuapullen.com",
  },
  {
    name: "River Way",
    description: "2021 Intern, written and interactive adaptations of videos",
  },
  {
    name: "Vivek Verma",
    description: "2021 Intern, written and interactive adaptations of videos",
  },
  {
    name: "Sridhar Ramesh",
    description:
      "Writing and visuals for the winding number and Wallis product videos",
  },
  {
    name: "Ben Hambrecht",
    description: "Writing and visuals for the Basel problem and pi day 2018",
    link: "https://www.hambrecht.ch",
  },
].map(mapMember);

// grid of current team members
export function Current() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(auto,--spacing(40)))] justify-center gap-12 p-2">
      {current.map((member, index) => (
        <Portrait key={index} {...member} />
      ))}
    </div>
  );
}

// grid of past contributors
export function Past() {
  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(auto,--spacing(30)))] justify-center gap-8 p-2">
      {past.map((member, index) => (
        <Portrait key={index} {...member} className="text-sm" />
      ))}
    </div>
  );
}

// member image, name, and description
function Portrait({
  name,
  image,
  description,
  link = "",
  className,
}: Partial<Member> & ComponentProps<"div">) {
  return (
    <div
      className={clsx(
        "group flex flex-col items-center gap-1 text-center",
        className,
      )}
    >
      <Link
        to={link}
        className="aspect-square w-full overflow-hidden rounded-full outline-2 outline-offset-2 outline-theme"
      >
        <img
          src={image}
          alt={name}
          className="size-full object-cover transition group-hover:grayscale"
        />
      </Link>
      {name && <div className="mt-4 font-sans font-medium">{name}</div>}
      {description && <div>{description}</div>}
    </div>
  );
}
