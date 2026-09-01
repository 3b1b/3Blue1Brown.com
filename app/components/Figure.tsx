import type { ReactNode } from "react";
import { ImageIcon, VideoIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Image from "~/components/Image";
import Tabs, { Panel } from "~/components/Tabs";
import { usePrinting } from "~/util/hooks";

type Props = {
  // image source
  image?: string;
  // video source
  video?: string;
  // which to show by default
  show?: "image" | "video";
  // whether to loop video
  loop?: boolean;
  // class on image/video element
  className?: string;
  // caption content
  children?: ReactNode;
};

// combination image/video
export default function Figure({
  image,
  video,
  show,
  loop,
  className,
  children,
}: Props) {
  // image to render
  const imageElement = children ? (
    <Image image={image ?? ""} className={clsx("w-full", className)}>
      {children}
    </Image>
  ) : (
    // wrapper keeps img out of parent flex layout, where Safari loses its aspect ratio
    <div className="w-full">
      <Image
        image={image ?? ""}
        className={clsx("block h-auto w-full", className)}
      />
    </div>
  );

  // video to render
  const videoElement = (
    <video controls className={className} loop={loop}>
      <track kind="captions" label="No captions available" />
      <source src={video ?? ""} type="video/mp4" />
    </video>
  );

  if (usePrinting()) return imageElement;

  // if only one or the other, just show that one
  if (image && !video) return imageElement;
  if (video && !image) return videoElement;

  // if neither, show nothing
  if (!image && !video) return null;

  // if both, show tabs
  return (
    <Tabs defaultIndex={show === "video" ? 1 : 0}>
      <Panel
        title={
          <>
            <ImageIcon />
            Image
          </>
        }
      >
        {imageElement}
      </Panel>
      <Panel
        title={
          <>
            <VideoIcon />
            Video
          </>
        }
      >
        {videoElement}
      </Panel>
    </Tabs>
  );
}
