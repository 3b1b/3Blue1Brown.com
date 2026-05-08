import type { RefObject } from "react";
import { useCallback, useState } from "react";
import { useEventListener, useUnmount } from "@reactuses/core";
import { atom, getDefaultStore, useAtomValue } from "jotai";
import { getAtom, setAtom } from "~/util/atom";
import { scrollTo } from "~/util/dom";
import { waitFor } from "~/util/misc";

// is any video on site playing
export const videoPlayingAtom = atom(false);

// update flag on document
getDefaultStore().sub(videoPlayingAtom, () => {
  // allow convenient styling based on play state
  document.documentElement.classList[
    getAtom(videoPlayingAtom) ? "add" : "remove"
  ]("playing");
});

// trigger site-wide video play event
export const play = async () => {
  window.dispatchEvent(new CustomEvent(playEvent));
  setAtom(videoPlayingAtom, true);
};

// trigger site-wide video stop event
export const stop = async () => {
  window.dispatchEvent(new CustomEvent(stopEvent));
  setAtom(videoPlayingAtom, false);
};

// custom event names
const playEvent = "video-play";
const stopEvent = "video-stop";

// custom event types
type PlayEvent = CustomEvent;
type StopEvent = CustomEvent;

// define custom events on window
declare global {
  // eslint-disable-next-line -- for declaration merging
  interface WindowEventMap {
    [playEvent]: PlayEvent;
    [stopEvent]: StopEvent;
  }
}

// handle one instance of video element
export const useVideo = (ref: RefObject<HTMLVideoElement | null>) => {
  // site-wide playing state
  const playing = useAtomValue(videoPlayingAtom);

  // whether to show real embed or static thumbnail
  const [enabled, setEnabled] = useState(false);

  // play video instance
  const play = useCallback(async () => {
    setEnabled(true);
    // wait for element to render
    const element = await waitFor(() => ref.current);
    // start scroll
    scrollTo(element, { behavior: "smooth", block: "center" });
    // wait for video to be ready
    await waitFor(() => element?.readyState === 4);
    // play video
    await element?.play();
  }, [ref]);

  // stop video instance
  const stop = useCallback(async () => {
    setEnabled(false);
    // stop video
    await ref.current?.pause();
  }, [ref]);

  // respond to user interaction directly with video instance
  const onPlay = useCallback(() => setAtom(videoPlayingAtom, true), []);
  const onStop = useCallback(() => setAtom(videoPlayingAtom, false), []);

  useUnmount(() => {
    // stop video on unmount
    stop();
  });

  // respond to site-wide play/stop events
  useEventListener(playEvent, play);
  useEventListener(stopEvent, stop);

  return { enabled, playing, play, stop, onPlay, onStop };
};
