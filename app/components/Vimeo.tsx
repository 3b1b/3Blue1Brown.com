import type { ComponentProps } from "react";
import clsx from "clsx";

type Props = {
  id: string;
  hash?: string;
} & ComponentProps<"iframe">;

export default function VimeoEmbed({ id, hash, className, ...props }: Props) {
  const url = new URL(`https://player.vimeo.com/video/${id}`);
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
      className={clsx("aspect-video w-full", className)}
      aria-label="Vimeo video"
      {...props}
    />
  );
}
