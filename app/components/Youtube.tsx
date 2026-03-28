import type { ComponentProps } from "react";
import { useRef } from "react";
import { useEventListener } from "@reactuses/core";
import clsx from "clsx";
import { atom } from "jotai";
import { setAtom } from "~/util/atom";
import { scrollTo } from "~/util/dom";
import { waitFor } from "~/util/misc";
import "youtube-video-element";

type Props = {
  // youtube video id
  id?: string;
} & ComponentProps<"video">;

// youtube player embed
export default function YouTube({ id, className, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  className = clsx(
    `grid aspect-video w-full min-w-0 place-items-center font-sans text-xl`,
    className,
  );

  const play = async () => {
    scrollTo(ref.current, { behavior: "smooth", block: "center" });
    await waitFor(() => ref.current?.readyState === 4);
    await ref.current?.play();
    setAtom(playingAtom, true);
  };

  const stop = async () => {
    await ref.current?.pause();
    setAtom(playingAtom, false);
  };

  // listen for play event
  useEventListener(playEvent, play);

  // listen for stop event
  useEventListener(stopEvent, stop);

  // listen for play/pause events to set playing state
  useEventListener("play", () => setAtom(playingAtom, true), ref);
  useEventListener("pause", () => setAtom(playingAtom, false), ref);

  if (!id) return <div className={className}>No video</div>;

  return (
    <youtube-video
      ref={ref}
      className={className}
      src={getWatch(id)}
      poster={getThumbnail(id)}
      controls
      autoPlay={false}
      role="region"
      aria-label="YouTube video"
      {...props}
    />
  );
}

// funcs to conveniently control video from outside component

export const playingAtom = atom(false);

// trigger play event
export const play = async () =>
  window.dispatchEvent(new CustomEvent(playEvent));

// trigger stop event
export const stop = async () =>
  window.dispatchEvent(new CustomEvent(stopEvent));

// custom event names
const playEvent = "youtube-play";
const stopEvent = "youtube-stop";

// custom event types
type YouTubePlayEvent = CustomEvent;
type YouTubeStopEvent = CustomEvent;

// define custom events on window
declare global {
  // eslint-disable-next-line
  interface WindowEventMap {
    [playEvent]: YouTubePlayEvent;
    [stopEvent]: YouTubeStopEvent;
  }
}

// get watch video from id
export const getWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;

// get thumbnail image from video id
export const getThumbnail = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
