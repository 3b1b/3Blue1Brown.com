import "youtube-video-element";
import type { ComponentProps } from "react";
import { useRef } from "react";
import { PlayIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import backlightFilter from "~/components/backlight.svg?inline";
import { useVideo } from "~/components/video";
import { useClient } from "~/util/hooks";

// https://www.npmjs.com/package/youtube-video-element
// mirrors native <video> element api

type Props = {
  // youtube video id
  id?: string;
  // start time
  time?: number;
  // backlight effect
  backlight?: boolean;
} & ComponentProps<"video">;

// youtube player embed
export default function YouTube({
  id,
  time,
  backlight = false,
  className,
  ...props
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  const { enabled, playing, play, onPlay, onStop } = useVideo(ref);

  className = clsx(
    "relative grid aspect-video w-full min-w-0 place-items-center bg-white font-sans text-xl",
    className,
  );

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
        <img src={getThumbnail(id)} alt="" className="size-full object-cover" />
        <div className="absolute grid size-20 place-items-center rounded-full bg-white">
          <PlayIcon
            className="size-12 transition group-hover:text-theme"
            weight="fill"
          />
        </div>
      </button>
    );

  // video embed
  return (
    <youtube-video
      ref={ref}
      className={className}
      src={getWatch(id, time)}
      poster={getThumbnail(id)}
      onplay={onPlay}
      onpause={onStop}
      controls
      role="region"
      aria-label="YouTube video"
      style={{
        filter:
          backlight && playing ? `url("${backlightFilter}#filter")` : undefined,
      }}
      {...props}
    />
  );
}

// get watch video from id
export const getWatch = (id: string, time = 0) =>
  `https://www.youtube.com/watch?v=${id}&t=${time}s`;

// get thumbnail image from video id
export const getThumbnail = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
