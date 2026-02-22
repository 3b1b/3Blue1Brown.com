import type { ComponentProps } from "react";

type Props = {
  video: string;
  hash?: string;
} & ComponentProps<"iframe">;

export default function VimeoEmbed({ video, hash, ...props }: Props) {
  const url = new URL(`https://player.vimeo.com/video/${video}`);
  url.searchParams.set("badge", "0");
  url.searchParams.set("autopause", "0");
  url.searchParams.set("player_id", "0");
  url.searchParams.set("app_id", "58479");
  url.searchParams.set("title", "0");
  url.searchParams.set("byline", "0");
  url.searchParams.set("portrait", "0");
  url.searchParams.set("sidedock", "0");
  if (hash) url.searchParams.set("h", hash);

  return (
    <iframe
      src={url.toString()}
      allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
      referrerPolicy="strict-origin-when-cross-origin"
      {...props}
    />
  );
}
