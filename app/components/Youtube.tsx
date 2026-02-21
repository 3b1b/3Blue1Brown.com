import type { ComponentProps } from "react";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useEventListener, useUnmount } from "@reactuses/core";
import clsx from "clsx";
import { atom } from "jotai";
import { setAtom } from "~/util/atom";
import { waitFor } from "~/util/misc";
import { getThumbnail } from "~/util/youtube";
import "youtube-video-element";

type Props = {
  id?: string;
} & ComponentProps<"video">;

export default function Youtube({ id, className, ...props }: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  className = clsx(
    `grid place-items-center bg-current/10 font-sans text-xl`,
    className,
  );

  const play = async () => {
    await waitFor(() => (ref.current?.readyState ?? 0) > 0);
    ref.current?.play();
    ref.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    setAtom(playingAtom, true);
  };

  const stop = () => {
    ref.current?.pause();
    setAtom(playingAtom, false);
  };

  // listen for play event
  useEventListener("youtube-video-play", play);

  // listen for stop event
  useEventListener("youtube-video-stop", stop);

  // listen for play/pause events to set playing state
  useEventListener("play", () => setAtom(playingAtom, true), ref);
  useEventListener("pause", () => setAtom(playingAtom, false), ref);

  // stop playback on route change
  const location = useLocation();
  useEffect(() => {
    stop();
  }, [location]);

  // stop playback on unmount
  useUnmount(stop);

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
