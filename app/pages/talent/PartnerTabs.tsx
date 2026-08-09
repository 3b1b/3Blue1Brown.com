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
    about = "",
    youtube = "",
    vimeo = "",
    vimeoHash,
  } = partner.frontmatter;

  const { default: Message } = getMessage(id) ?? {};
  const { default: Challenge } = getChallenge(id) ?? {};

  const hasVideo = !!(youtube || vimeo);

  if (!hasVideo && !Message && !about && !Challenge) return null;

  return (
    <Tabs className={className}>
      {hasVideo && (
        <Panel title="Meet the Team">
          {youtube ? (
            <YouTube id={youtube} />
          ) : (
            <Vimeo id={vimeo} hash={vimeoHash} />
          )}
        </Panel>
      )}

      {Message && (
        <Panel title="Message from Grant">
          {/* clicking over to this tab is already intent to read it */}
          <ShowPartial defaultOpen={hasVideo}>
            <Message />
          </ShowPartial>
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
  );
}
