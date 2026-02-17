import clsx from "clsx";
import DarkMode from "~/components/DarkMode";
import Link from "~/components/Link";

const links = [
  {
    name: "Channel",
    to: "https://www.youtube.com/c/3blue1brown",
  },
  {
    name: "Talent",
    to: "/talent",
  },
  {
    name: "Patreon",
    to: "https://www.patreon.com/c/3blue1brown",
  },
  {
    name: "Store",
    to: "https://store.dftba.com/collections/3blue1brown",
  },
  {
    name: "About",
    to: "/about",
  },
];

export default function Nav({ className = "", childClassName = "" }) {
  return (
    <>
      <nav
        id="nav"
        className={clsx(
          `flex flex-wrap items-center justify-center gap-4 font-sans text-lg`,
          className,
        )}
      >
        {links.map(({ name, to }) => (
          <Link key={to} to={to} arrow={false} className={childClassName}>
            {name}
          </Link>
        ))}
        <DarkMode className={childClassName} />
      </nav>
    </>
  );
}
