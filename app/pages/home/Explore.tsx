import { useState } from "react";
import Heading from "~/components/Heading";
import Textbox from "~/components/Textbox";

const topics = [
  "Neural Networks",
  "Linear Algebra",
  "Calculus",
  "Differential Equations",
  "Puzzles",
  "Geometry",
  "Why Pi",
  "Analysis",
  "Physics",
  "Computer Science",
  "Fractals",
  "Probability",
  "Group Theory",
  "Number Theory",
  "Lockdown Math",
  "Talks",
];

export default function Explore() {
  const [search, setSearch] = useState("");

  return (
    <section className="narrow">
      <Heading level={2} className="sr-only">
        Explore
      </Heading>

      <div className="grid grid-cols-4 gap-4">
        <Textbox
          value={search}
          onChange={setSearch}
          className="col-span-full mb-4"
          placeholder="Search"
        />
        {topics.map((topic, index) => (
          <button
            key={index}
            className="aspect-video bg-off-black text-white"
            onClick={() => setSearch(`Topic: ${topic}`)}
          >
            {topic}
          </button>
        ))}
        <button
          className="col-span-full bg-off-black p-4 text-white"
          onClick={() => setSearch("ALL")}
        >
          All
        </button>
      </div>
    </section>
  );
}
