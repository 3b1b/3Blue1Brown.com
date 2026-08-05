import type { ReactNode } from "react";
import { href } from "react-router";
import Link from "~/components/Link";
import ShowPartial from "~/components/ShowPartial";
import Tabs, { Panel } from "~/components/Tabs";
import Vimeo from "~/components/Vimeo";
import YouTube from "~/components/YouTube";
import { getChallenge, getMessage, getPartner } from "./Partner";

// mdx blocks stack with gaps, like the sections they'd sit in on a partner page
const prose = "flex w-full flex-col gap-4";

type Props = {
  // partner id (folder name)
  id: string;
};

// tabbed detail for a partner, filled with whatever content that partner has
export default function PartnerTabs({ id }: Props) {
  const partner = getPartner(id);

  if (!partner) return null;

  const {
    name = "",
    quote = "",
    youtube = "",
    vimeo = "",
    vimeoHash,
  } = partner.frontmatter;

  const { default: Message } = getMessage(id) ?? {};
  const { default: Challenge } = getChallenge(id) ?? {};

  const tabs: { label: string; content: ReactNode }[] = [];

  // interview with the team, same video featured at top of partner's page
  if (youtube || vimeo)
    tabs.push({
      label: "Meet the Team",
      content: youtube ? (
        <YouTube id={youtube} />
      ) : (
        <Vimeo id={vimeo} hash={vimeoHash} />
      ),
    });

  // grant's message, if written yet, else fall back to partner's own words
  if (Message)
    tabs.push({
      label: "Message from Grant",
      content: (
        // ShowPartial owns the fade, toggle, and its own block spacing
        <div className="w-full">
          <ShowPartial>
            <Message />
          </ShowPartial>
        </div>
      ),
    });
  else if (quote)
    tabs.push({
      label: `About ${name}`,
      content: (
        <div className={prose}>
          <p>{quote}</p>
        </div>
      ),
    });

  // technical challenge or puzzle, for partners that wrote one
  if (Challenge)
    tabs.push({
      label: "Challenge",
      content: (
        <div className={prose}>
          <Challenge />

          <Link to={href("/talent/:id", { id })} className="self-center">
            See the full challenge
          </Link>
        </div>
      ),
    });

  if (!tabs.length) return null;

  return (
    <Tabs tabs={tabs.map((tab) => tab.label)} className="w-full">
      {tabs.map((tab, index) => (
        <Panel key={index}>{tab.content}</Panel>
      ))}
    </Tabs>
  );
}
