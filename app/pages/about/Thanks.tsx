import clsx from "clsx";
import ShowPartial from "~/components/ShowPartial";
import patrons from "./patrons.json";

export default function Thanks() {
  if (patrons.length === 0) return null;

  return (
    <ShowPartial>
      <div className="grid max-w-max grid-cols-3 gap-4 self-center max-md:grid-cols-2 max-sm:grid-cols-1">
        {patrons.map(({ name, current }, index) => (
          <div key={index} className={clsx(current ? "" : "text-gray")}>
            {name}
          </div>
        ))}
      </div>
    </ShowPartial>
  );
}
