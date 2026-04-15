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
  const imageElement = (
    <Image image={image ?? ""} className={clsx("w-full", className)}>
      {children}
    </Image>
  );

  // video to render
  const videoElement = (
    <video controls className={className} loop={loop}>
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
    <Tabs
      tabs={[
        <>
          <ImageIcon />
          Image
        </>,
        <>
          <VideoIcon />
          Video
        </>,
      ]}
      defaultValue={show}
    >
      <Panel>{imageElement}</Panel>
      <Panel>{videoElement}</Panel>
    </Tabs>
  );
}
