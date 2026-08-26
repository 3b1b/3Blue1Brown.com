import type { PartnerVideo as Info } from "~/pages/talent/Partner";
import Vimeo from "~/components/Vimeo";
import YouTube from "~/components/YouTube";

type Props = {
  video: Info;
  // custom thumbnail, overriding youtube's/vimeo's
  thumbnail?: string;
};

// partner interview/whiteboard/etc. video, with optional caption
export default function PartnerVideo({ video, thumbnail }: Props) {
  const { video: id = "", type, hash, caption } = video;

  const player =
    type === "vimeo" ? (
      <Vimeo id={id} hash={hash} thumbnail={thumbnail} />
    ) : (
      <YouTube id={id} thumbnail={thumbnail} />
    );

  if (!caption) return player;

  return (
    <figure className="flex flex-col items-center gap-4">
      {player}
      <figcaption className="text-dark-gray">{caption}</figcaption>
    </figure>
  );
}
