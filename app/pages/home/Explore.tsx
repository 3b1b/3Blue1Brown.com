import { useState } from "react";
import Heading from "~/components/Heading";
import Textbox from "~/components/Textbox";
import { lessons } from "~/data/lessons";
import { images } from "~/pages/home/topics";

const topics = lessons
  .concat([{ id: "all", name: "All", description: "All lessons", lessons: [] }])
  .map(({ id, name }) => ({ name, img: images[id] }));

export default function Explore() {
  const [search, setSearch] = useState("");

  return (
    <section className="narrow">
      <Heading level={2}>
        <hr />
        Explore
        <hr />
      </Heading>

      <div
        className="
          grid grid-cols-4 gap-4
          max-md:grid-cols-2
        "
      >
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
              flex-col bg-off-black text-white outline-offset-2 outline-theme
              hover:bg-theme hover:outline-2
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
