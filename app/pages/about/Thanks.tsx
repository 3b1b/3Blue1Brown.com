import ShowPartial from "~/components/ShowPartial";
import patrons from "./patrons.json";

// list of all patrons
export default function Thanks() {
  if (patrons.length === 0) return null;

  return (
    <ShowPartial>
      <div className="grid max-w-max grid-cols-4 gap-4 self-center max-lg:grid-cols-3 max-md:grid-cols-2 max-sm:grid-cols-1">
        {patrons.map((name, index) => (
          <div key={index}>{name}</div>
        ))}
      </div>
    </ShowPartial>
  );
}
