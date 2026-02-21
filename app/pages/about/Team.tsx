import Portrait from "~/components/Portrait";
import { importAssets } from "~/util/file";

// get portrait image
const { lookUp } = importAssets(
  import.meta.glob("./images/portraits/*.jpg", {
    eager: true,
    // limit size, compress
    query: "w=600&format=webp",
  }),
);

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
  image: lookUp(name),
  link,
});

// main author
export function Grant() {
  return (
    <Portrait
      name="Grant Sanderson"
      image={lookUp("Grant Sanderson")}
      description="Creator"
      className="w-50"
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
