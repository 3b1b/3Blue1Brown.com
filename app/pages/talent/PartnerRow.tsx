import { href } from "react-router";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { useDarkMode } from "~/components/DarkMode";
import Link from "~/components/Link";
import { getPartner, getWordmark, getWordmarkDark } from "./Partner";
import PartnerTabs from "./PartnerTabs";

// base wordmark height, before per-partner wordmarkScale (rem)
const wordmarkHeight = 3.25;

// largest wordmarkScale any partner uses. raise alongside it, or the tallest
// wordmark outgrows the reserved row below and taglines stop lining up
const maxWordmarkScale = 1.2;

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
    wordmarkScale = 1,
  } = partner.frontmatter;

  const wordmark = darkMode ? getWordmarkDark(id) : getWordmark(id);
  const to = href("/talent/:id", { id });

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,1.25fr)] items-center gap-x-12 gap-y-6 max-md:grid-cols-1">
      {/* identity */}
      <div className="flex flex-col items-center gap-4 text-center">
        <Link
          to={to}
          arrow={false}
          style={{ minHeight: `${wordmarkHeight * maxWordmarkScale}rem` }}
          className="flex items-center rounded-md text-black no-underline change-ring hocus:outline-theme"
        >
          {wordmark ? (
            <img
              src={wordmark}
              alt={name}
              style={{ height: `${wordmarkHeight * wordmarkScale}rem` }}
              className="w-auto object-contain"
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
