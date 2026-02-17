import type { ComponentProps } from "react";
import { useRef } from "react";
import { useEventListener } from "@reactuses/core";
import clsx from "clsx";
import { atom } from "jotai";
import { waitFor } from "~/util/misc";
import { getThumbnail } from "~/util/youtube";
import "youtube-video-element";
import { setAtom } from "~/util/atom";

type Props = {
  id?: string;
} & ComponentProps<"video">;

export default function Youtube({ id, className, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  className = clsx(
    `grid place-items-center bg-current/10 font-sans text-xl`,
    className,
  );

  // listen for play event
  useEventListener("youtube-video-play", async () => {
    await waitFor(() => (ref.current?.readyState ?? 0) > 0);
    ref.current?.play();
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  });

  // listen for stop event
  useEventListener("youtube-video-stop", () => ref.current?.pause());

  useEventListener("play", () => setAtom(playingAtom, true), ref);
  useEventListener("pause", () => setAtom(playingAtom, false), ref);

  if (!id) return <div className={className}>No video</div>;

  return (
    <youtube-video
      ref={ref}
      className={className}
      src={`https://www.youtube.com/watch?v=${id}`}
      poster={getThumbnail(id)}
      controls
      autoPlay={false}
      {...props}
    />
  );
}

// funcs to conveniently control video from outside component

export const playingAtom = atom(false);

// trigger play event
export const play = async () =>
  window.dispatchEvent(new CustomEvent("youtube-video-play"));

// trigger stop event
export const stop = async () =>
  window.dispatchEvent(new CustomEvent("youtube-video-stop"));
