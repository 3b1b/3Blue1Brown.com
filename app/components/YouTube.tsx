import type { ComponentProps } from "react";
import { useRef, useState } from "react";
import { YoutubeLogoIcon } from "@phosphor-icons/react";
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
  // start time
  time?: number;
} & ComponentProps<"video">;

// youtube player embed
export default function YouTube({ id, time, className, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  const [enabled, setEnabled] = useState(false);

  className = clsx(
    `grid aspect-video w-full min-w-0 place-items-center font-sans text-xl`,
    className,
  );

  const play = async () => {
    setEnabled(true);
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

  if (!enabled)
    return (
      <button
        onClick={play}
        aria-label="Play video"
        className={clsx(className, "group")}
      >
        <img src={getThumbnail(id)} alt="" className="size-full object-cover" />
        <div className="absolute grid size-20 place-items-center rounded-full bg-white">
          <YoutubeLogoIcon
            className="size-12 transition group-hover:text-theme"
            weight="fill"
          />
        </div>
      </button>
    );

  return (
    <youtube-video
      ref={ref}
      className={className}
      src={getWatch(id, time)}
      poster={getThumbnail(id)}
      controls
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
export const getWatch = (id: string, t = 0) =>
  `https://www.youtube.com/watch?v=${id}&t=${t}s`;

// get thumbnail image from video id
export const getThumbnail = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
