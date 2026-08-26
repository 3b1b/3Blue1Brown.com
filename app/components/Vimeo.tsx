import type { ComponentProps } from "react";
import { useEffect, useRef, useState } from "react";
import { PlayIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import { request } from "~/api";
import backlightFilter from "~/components/backlight.svg?inline";
import { useVideo } from "~/components/video";
import { useClient } from "~/util/hooks";

// https://www.npmjs.com/package/vimeo-video-element
// mirrors native <video> element api

type Props = {
  // vimeo video id
  id: string;
  // vimeo video hash for private videos
  hash?: string;
  // custom thumbnail, overriding vimeo's
  thumbnail?: string;
  // backlight effect
  backlight?: boolean;
} & ComponentProps<"iframe">;

// vimeo video player embed
export default function Vimeo({
  id,
  hash,
  thumbnail: customThumbnail,
  backlight = false,
  className,
  ...props
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  const [thumbnail, setThumbnail] = useState("");
  const [libLoaded, setLibLoaded] = useState(false);

  const { enabled, play, playing, onPlay, onStop } = useVideo(ref);

  className = clsx(
    "relative grid aspect-video w-full min-w-0 place-items-center bg-white font-sans text-xl",
    className,
  );

  // load vimeo player library on client only
  useEffect(() => {
    let cancelled = false;

    import("vimeo-video-element")
      .then(() => {
        if (!cancelled) setLibLoaded(true);
      })
      .catch(() => {
        if (!cancelled) setLibLoaded(false);
      });

    return () => {
      cancelled = true;
    };
  }, []); // fetch thumbnail

  useEffect(() => {
    if (customThumbnail) return;
    getThumbnail(id, hash).then(setThumbnail);
  }, [id, hash, customThumbnail]);

  // needed for on play/pause to work properly
  if (!useClient()) return <div className={className} />;

  if (!id) return <div className={className}>No video</div>;

  // static thumbnail play button
  if (!enabled)
    return (
      <button
        onClick={play}
        aria-label="Play video"
        className={clsx(className, "group")}
      >
        <img
          src={customThumbnail || thumbnail || undefined}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-full object-cover"
        />
        <div className="absolute grid size-20 place-items-center rounded-full bg-white">
          <PlayIcon
            className="size-12 transition group-hover:text-theme"
            weight="fill"
          />
        </div>
      </button>
    );

  if (!libLoaded) return <div className={className} />;

  // video embed
  return (
    <vimeo-video
      ref={ref}
      className={className}
      src={getWatch(id, hash)}
      onplay={onPlay}
      onpause={onStop}
      controls
      style={{
        filter:
          backlight && playing ? `url("${backlightFilter}#filter")` : undefined,
      }}
      {...props}
    />
  );
}

// get video watch url
export const getWatch = (id: string, hash?: string) =>
  `https://vimeo.com/${id}?h=${hash}`;

// get thumbnail image url
export const getThumbnail = async (id: string, hash?: string) => {
  const watch = window.encodeURIComponent(getWatch(id, hash));
  const url = `https://vimeo.com/api/oembed.json?url=${watch}&width=1920&height=1080`;
  return (await request<{ thumbnail_url: string }>(url)).thumbnail_url;
};
