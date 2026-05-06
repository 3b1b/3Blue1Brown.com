import "vimeo-video-element";
import type { ComponentProps } from "react";
import { useRef } from "react";
import clsx from "clsx";
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
  // backlight effect
  backlight?: boolean;
} & ComponentProps<"iframe">;

// vimeo video player embed
export default function Vimeo({
  id,
  hash,
  backlight = false,
  className,
  ...props
}: Props) {
  const ref = useRef<HTMLVideoElement>(null);

  const { playing, onPlay, onStop } = useVideo(ref);

  className = clsx(
    "relative grid aspect-video w-full min-w-0 place-items-center bg-white font-sans text-xl",
    className,
  );

  // needed for on play/pause to work properly
  if (!useClient()) return <div className={className} />;

  if (!id) return <div className={className}>No video</div>;

  console.log(getWatch(id, hash));

  // video embed
  return (
    <vimeo-video
      ref={ref}
      className={className}
      src={getWatch(id, hash)}
      onplay={onPlay}
      onpause={onStop}
      controls
      role="region"
      aria-label="Vimeo video"
      style={{
        filter:
          backlight && playing ? `url("${backlightFilter}#filter")` : undefined,
      }}
      {...props}
    />
  );
}

// get watch video from id
export const getWatch = (id: string, hash?: string) =>
  `https://player.vimeo.com/video/${id}?h=${hash}`;
