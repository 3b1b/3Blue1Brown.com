import type { ReactNode } from "react";
import ShowPartial from "~/components/ShowPartial";
import Tabs, { Panel } from "~/components/Tabs";
import Vimeo from "~/components/Vimeo";
import YouTube from "~/components/YouTube";
import { getChallenge, getMessage, getPartner } from "./Partner";

type Props = {
  // partner id
  id: string;
  // class on root
  className?: string;
};

// partner detail tabs
export default function PartnerTabs({ id, className }: Props) {
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

  // interview with team or other video
  if (youtube || vimeo)
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
      content: (
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
        <div className="flex w-full flex-col gap-4">
          <p>{quote}</p>
        </div>
      ),
    });

  // technical challenge or puzzle
  if (Challenge)
    tabs.push({
      label: "Challenge",
      content: (
        <div className="flex w-full flex-col gap-4">
          <Challenge />
        </div>
      ),
    });

  if (!tabs.length) return null;

  return (
    <Tabs tabs={tabs.map((tab) => tab.label)} className={className}>
      {tabs.map((tab, index) => (
        <Panel key={index}>{tab.content}</Panel>
      ))}
    </Tabs>
  );
}
