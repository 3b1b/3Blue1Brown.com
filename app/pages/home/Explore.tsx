import { useState } from "react";
import Heading from "~/components/Heading";
import Textbox from "~/components/Textbox";
import lessons from "~/data/lessons.yaml";
import { images } from "~/pages/home/topics";

const topics = lessons
  .concat([{ id: "all", name: "All", description: "All lessons", lessons: [] }])
  .map(({ id, name }) => ({ name, img: images[id] }));

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
        {topics.map(({ name, img }, index) => (
          <button
            key={index}
            className="
              flex-col bg-off-black text-white ring-theme ring-offset-2
              hover:bg-theme hover:ring-2
            "
            onClick={() => setSearch(`Topic: ${name}`)}
          >
            <img
              src={img ?? ""}
              alt=""
              className="aspect-video w-full mask-b-from-50% mask-b-to-100%"
            />
            <div className="p-2">{name}</div>
          </button>
        ))}
      </div>
    </section>
  );
}
