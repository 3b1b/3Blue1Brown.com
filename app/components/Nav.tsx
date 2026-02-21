import { href } from "react-router";
import clsx from "clsx";
import DarkMode from "~/components/DarkMode";
import Link from "~/components/Link";
import site from "~/data/site.yaml";

const links = [
  {
    name: "Channel",
    to: site.channel,
  },
  {
    name: "Talent",
    to: href("/"),
  },
  {
    name: "Patreon",
    to: site.patreon,
  },
  {
    name: "Store",
    to: site.store,
  },
  {
    name: "Extras",
    to: href("/extras"),
  },
  {
    name: "About",
    to: href("/about"),
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
        {/* jump button for accessibility */}
        <a
          href="#content"
          className="fixed top-0 left-0 z-100 bg-white p-2 text-black not-focus-visible:opacity-0"
          tabIndex={0}
        >
          Jump to main content
        </a>
        );
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
