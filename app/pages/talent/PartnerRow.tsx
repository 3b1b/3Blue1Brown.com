import { href } from "react-router";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { useDarkMode } from "~/components/DarkMode";
import Link from "~/components/Link";
import { getPartner, getWordmark, getWordmarkDark } from "./Partner";
import PartnerTabs from "./PartnerTabs";

type Props = {
  // partner id (folder name)
  id: string;
};

// single partner in gallery: identity on left, tabbed detail on right
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
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-start gap-x-12 gap-y-6 max-md:grid-cols-1">
      {/* identity. centers against a video-height panel, but stays put beside a tall one */}
      <div className="flex flex-col items-center gap-4 text-center md:max-h-80 md:justify-center md:self-stretch">
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

      {/* interview, message from grant, challenge */}
      <PartnerTabs id={id} />
    </div>
  );
}
