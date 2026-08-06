import { href } from "react-router";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import { useDarkMode } from "~/components/DarkMode";
import Link from "~/components/Link";
import { getPartner, getWordmark, getWordmarkDark } from "./Partner";
import PartnerTabs from "./PartnerTabs";

type Props = {
  // partner id
  id: string;
  // class on root
  className?: string;
};

// single partner in gallery
export default function PartnerRow({ id, className }: Props) {
  const darkMode = useDarkMode();

  const partner = getPartner(id);

  if (!partner) return null;

  const {
    name = "",
    tagline = "",
    location = "",
    apply = "",
  } = partner.frontmatter;

  const wordmark = darkMode ? getWordmarkDark(id) : getWordmark(id);

  const page = href("/talent/:id", { id });

  return (
    <div
      className={clsx("flex items-center gap-12 max-md:flex-col", className)}
    >
      {/* identity, high level details */}
      <div className="flex flex-2 flex-col items-center gap-4 text-center">
        <Link
          to={page}
          className="flex rounded-md text-black no-underline change-ring hocus:outline-theme"
        >
          {wordmark ? (
            <img
              src={wordmark}
              alt={name}
              className="h-14 w-auto object-contain"
            />
          ) : (
            <span className="font-sans text-2xl font-medium">{name}</span>
          )}
        </Link>

        <div className="font-sans text-lg text-balance">{tagline}</div>

        <div className="flex flex-wrap justify-center gap-4">
          <Button to={page} size="sm" color="light" className="w-30">
            Learn more
          </Button>

          {apply && (
            <Button to={apply} size="sm" color="theme" className="w-30">
              Apply
              <ArrowUpRightIcon />
            </Button>
          )}
        </div>

        <div className="font-sans text-gray">{location}</div>
      </div>

      {/* rich content, more details */}
      <PartnerTabs id={id} className="flex-3 self-start" />
    </div>
  );
}
