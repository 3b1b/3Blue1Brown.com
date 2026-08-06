import { href } from "react-router";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { useDarkMode } from "~/components/DarkMode";
import Link from "~/components/Link";
import { getPartner, getWordmark, getWordmarkDark } from "./Partner";
import PartnerTabs from "./PartnerTabs";

type Props = {
  // partner id
  id: string;
};

// single partner in gallery
export default function PartnerRow({ id }: Props) {
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
  const to = href("/talent/:id", { id });

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-center gap-x-12 gap-y-6 max-md:grid-cols-1">
      {/* identity, high level details */}
      <div className="flex flex-col items-center gap-4 text-center">
        <Link
          to={to}
          arrow={false}
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

        <div className="flex flex-wrap justify-center gap-2">
          <Button to={to} size="sm" color="light">
            Learn more
          </Button>

          {apply && (
            <Button to={apply} size="sm" color="theme">
              Apply
              <ArrowUpRightIcon />
            </Button>
          )}
        </div>

        <div className="font-sans text-gray">{location}</div>
      </div>

      {/* rich content, more details */}
      <PartnerTabs id={id} />
    </div>
  );
}
