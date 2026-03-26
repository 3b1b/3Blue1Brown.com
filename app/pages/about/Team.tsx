import { filter, find } from "lodash-es";
import Portrait from "~/components/Portrait";
import team from "~/data/team.json";
import { importAssets } from "~/util/import";

// get member portrait image
const [getImage] = importAssets(
  import.meta.glob<{ default: string }>("./portraits/*.jpg", {
    eager: true,
    // limit size, compress
    query: "w=600&format=webp",
  }),
  undefined,
  (module) => module.default,
);

type Member = (typeof team)[number];

// add fallbacks and get derived props
const mapMember = ({
  name = "",
  description = "",
  link = "",
}: Partial<Member>) => ({
  name,
  description,
  image: getImage(name) ?? "",
  link,
});

// main author
const author = mapMember(find(team, { group: "author" }) ?? {});

// current team members
const current = filter(team, { group: "current" }).map(mapMember);

// past contributors
const past = filter(team, { group: "past" }).map(mapMember);

// main author
export function Grant() {
  return <Portrait {...author} className="w-50" />;
}

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
