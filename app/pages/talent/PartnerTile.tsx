import type { ReactNode } from "react";
import { href } from "react-router";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { useDarkMode } from "~/components/DarkMode";
import Link from "~/components/Link";
import Tabs, { Panel } from "~/components/Tabs";
import Vimeo from "~/components/Vimeo";
import YouTube from "~/components/YouTube";
import {
  getChallenge,
  getMessage,
  getPartner,
  getWordmark,
  getWordmarkDark,
} from "./Partner";

type Props = {
  // partner id
  id: string;
};

// single partner in gallery
export default function PartnerTile({ id }: Props) {
  const darkMode = useDarkMode();

  const partner = getPartner(id);

  if (!partner) return null;

  const {
    name = "",
    tagline = "",
    location = "",
    apply = "",
    about = "",
    youtube = "",
    vimeo = "",
    vimeoHash,
  } = partner.frontmatter;

  const wordmark = darkMode ? getWordmarkDark(id) : getWordmark(id);
  const { default: Message } = getMessage(id) ?? {};
  const { default: Challenge } = getChallenge(id) ?? {};

  const page = href("/talent/:id", { id });

  const hasVideo = !!(youtube || vimeo);

  const tabs: { label: string; content: ReactNode }[] = [];

  // interview with team or other video
  if (hasVideo)
    tabs.push({
      label: "Meet the Team",
      content: youtube ? (
        <YouTube id={youtube} />
      ) : (
        <Vimeo id={vimeo} hash={vimeoHash} />
      ),
    });

  // message from grant
  if (Message)
    tabs.push({
      label: "Message from Grant",
      content: <Message />,
    });
  else if (about)
    tabs.push({
      label: `About ${name}`,
      content: <p>{about}</p>,
    });

  // technical challenge or puzzle
  if (Challenge)
    tabs.push({
      label: "Challenge",
      content: (
        <div className="flex flex-col gap-8">
          <Challenge />
        </div>
      ),
    });

  return (
    <div className="flex gap-12 max-md:flex-col">
      {/* identity, high level details */}
      <div className="flex flex-2 flex-col items-center justify-center gap-6 text-center md:h-92">
        <Link
          to={page}
          className="flex rounded-md text-black no-underline change-ring hocus:outline-theme"
        >
          {wordmark ? (
            <img
              src={wordmark}
              alt={name}
              className="h-20 w-auto object-contain"
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
      <Tabs tabs={tabs.map((tab) => tab.label)} className="flex-3 self-start">
        {tabs.map((tab, index) => (
          <Panel key={index}>{tab.content}</Panel>
        ))}
      </Tabs>
    </div>
  );
}
