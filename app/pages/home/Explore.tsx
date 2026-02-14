import { useState } from "react";
import { shuffle } from "lodash-es";
import Heading from "~/components/Heading";
import Textbox from "~/components/Textbox";
import { byDate, lessons } from "~/data/lessons";
import { images } from "~/pages/home/images";
import { useFuzzySearch, useSearchParams } from "~/util/hooks";
import { getThumbnail } from "~/util/youtube";

const buttons = [
  {
    id: "all",
    title: "All",
    description: "All lessons",
    lessons: byDate,
    prefix: "All",
  },
  {
    id: "shuffle",
    title: "Shuffle",
    description: "Shuffled lessons",
    lessons: shuffle(byDate),
    prefix: "Shuffle",
  },

  ...lessons.map((topic) => ({ ...topic, prefix: `${topic.title}` })),
]
  .filter((topic) => !topic.id.match(/misc/i))
  .map((button) => ({ ...button, img: images[button.id] }));

export default function Explore() {
  const [params, setParams] = useSearchParams();
  const [search, _setSearch] = useState(params.get("search") ?? "");

  const setSearch = (search: string) => {
    _setSearch(search);
    setParams((params) => {
      if (search.trim()) params.set("search", search.trim());
      else params.delete("search");
    });
  };

  const [prefix = "", query = ""] = search.includes(":")
    ? search.split(":")
    : ["", search];

  const list =
    buttons.find((button) => button.prefix === prefix)?.lessons ?? byDate;

  const results = useFuzzySearch(list, query);

  return (
    <section>
      <Heading level={2}>
        <hr />
        Explore
        <hr />
      </Heading>

      <div
        className="
          grid grid-cols-3 gap-4
          max-md:grid-cols-2
          max-sm:grid-cols-1
        "
      >
        <Textbox
          value={search}
          onChange={setSearch}
          className="col-span-full mb-4"
          placeholder="Search"
        />

        {/* topic cards */}
        {!search.trim() &&
          buttons.map(({ title, img, prefix }, index) => (
            <button
              key={index}
              className="
                flex-col bg-off-black text-white outline-offset-2 outline-theme
                hover:bg-theme hover:outline-2
              "
              onClick={() => setSearch(`${prefix}:`)}
            >
              <img
                src={img ?? ""}
                alt=""
                className="aspect-video w-full mask-b-from-50% mask-b-to-100%"
              />
              <div className="p-2">{title}</div>
            </button>
          ))}

        {/* search results */}
        {!!search.trim() &&
          results.map(({ title, description, video }, index) => (
            <button
              key={index}
              className="
                flex-col justify-start bg-off-black text-white outline-offset-2
                outline-theme
                hover:bg-theme hover:outline-2
              "
            >
              <img
                src={getThumbnail(video)}
                alt=""
                className="aspect-video w-full mask-b-from-50% mask-b-to-100%"
              />
              <div className="flex flex-col gap-2 p-4">
                <strong className="font-sans">{title}</strong>
                <p className="line-clamp-5">{description}</p>
              </div>
            </button>
          ))}
      </div>
    </section>
  );
}
