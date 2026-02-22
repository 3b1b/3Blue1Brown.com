import { href } from "react-router";
import clsx from "clsx";
import Button from "~/components/Button";
import DarkMode from "~/components/DarkMode";
import site from "~/data/site.yaml";

const links = [
  {
    name: "Channel",
    to: site.channel,
  },
  {
    name: "Talent",
    to: href("/talent"),
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
        {links.map(({ name, to }) => (
          <Button key={to} to={to} arrow={false} size="sm">
            {name}
          </Button>
        ))}
        <DarkMode />
      </nav>
    </>
  );
}
