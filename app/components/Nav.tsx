import { href } from "react-router";
import clsx from "clsx";
import Button from "~/components/Button";
import DarkMode from "~/components/DarkMode";
import site from "~/data/site.json";

const links = [
  {
    name: "Channel",
    to: site.socials.channel,
  },
  {
    name: "Talent",
    to: href("/talent"),
  },
  {
    name: "Patreon",
    to: site.socials.patreon,
  },
  {
    name: "Store",
    to: site.socials.store,
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

// main site navigation
export default function Nav({ className = "" }) {
  return (
    <>
      <nav
        id="nav"
        className={clsx(
          `flex flex-wrap items-center justify-center gap-4 font-sans text-lg`,
          className,
        )}
      >
        {links.map(({ name, to }, index) => (
          <Button
            key={index}
            to={to}
            arrow={false}
            size="sm"
            className={index === 0 ? "border" : undefined}
          >
            {name}
          </Button>
        ))}
        <DarkMode />
      </nav>
    </>
  );
}
