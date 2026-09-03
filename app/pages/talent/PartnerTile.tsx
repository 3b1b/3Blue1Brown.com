import { href } from "react-router";
import { ArrowUpRightIcon } from "@phosphor-icons/react";
import Button from "~/components/Button";
import { useDarkMode } from "~/components/DarkMode";
import Link from "~/components/Link";
import Tabs, { Panel } from "~/components/Tabs";
import PartnerVideo from "~/pages/talent/PartnerVideo";
import {
  getChallenge,
  getFeature,
  getMessage,
  getPartner,
  getThumbnail,
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
    interview,
    extra,
  } = partner.frontmatter;

  const wordmark = darkMode ? getWordmarkDark(id) : getWordmark(id);
  const thumbnail = getThumbnail(id);
  const { default: Message } = getMessage(id) ?? {};
  const { default: Challenge } = getChallenge(id) ?? {};
  const { default: Feature } = getFeature(id) ?? {};

  const page = href("/talent/:id", { id });

  return (
    <div className="flex gap-12 max-md:flex-col">
      {/* identity, high level details */}
      <div className="flex flex-2 flex-col items-center gap-6 text-center md:mt-16">
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
      <Tabs className="flex-3 self-start">
        {extra?.video && (
          <Panel title={extra.title ?? ""}>
            <PartnerVideo video={extra} />
          </Panel>
        )}

        {interview?.video && (
          <Panel title={interview.title || "Meet the Team"}>
            <PartnerVideo video={interview} thumbnail={thumbnail} />
          </Panel>
        )}

        {Feature && (
          <Panel title="Featured Work">
            <div className="flex flex-col gap-8">
              <Feature />
            </div>
          </Panel>
        )}

        {Message && (
          <Panel title="From Grant">
            <Message />
          </Panel>
        )}
        {!Message && about && (
          <Panel title={`About ${name}`}>
            <p>{about}</p>
          </Panel>
        )}

        {Challenge && (
          <Panel title="Challenge">
            <div className="flex flex-col gap-8">
              <Challenge />
            </div>
          </Panel>
        )}
      </Tabs>
    </div>
  );
}
