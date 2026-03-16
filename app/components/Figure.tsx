import type { ReactNode } from "react";
import { useState } from "react";
import { Tabs } from "@base-ui/react";
import { ImageIcon, VideoIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import Image from "~/components/Image";

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
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  // image to render
  const imageElement = (
    <Image
      image={image ?? ""}
      // if not loaded, reserve some space to reduce layout shift
      className={clsx("w-full", !imageLoaded && "aspect-video", className)}
      onLoad={() => setImageLoaded(true)}
    >
      {children}
    </Image>
  );

  // video to render
  const videoElement = (
    <video
      controls
      className={clsx(className, !videoLoaded && "aspect-video")}
      loop={loop}
      onLoadedData={() => setVideoLoaded(true)}
    >
      <source src={video ?? ""} type="video/mp4" />
    </video>
  );

  // if only one or the other, just show that one
  if (image && !video) return imageElement;
  if (video && !image) return videoElement;

  // if neither, show nothing
  if (!image && !video) return null;

  // tab button
  const tab: Tabs.Tab.Props["render"] = (props, state) => (
    <Button {...props} color={state.active ? "light" : undefined} />
  );

  // if both, show tabs
  return (
    <Tabs.Root className="flex flex-col items-center gap-4" defaultValue={show}>
      <Tabs.List className="flex items-center gap-4">
        <Tabs.Tab value="image" render={tab}>
          <ImageIcon />
          Image
        </Tabs.Tab>
        <Tabs.Tab value="video" render={tab}>
          <VideoIcon />
          Video
        </Tabs.Tab>
        <Tabs.Indicator />
      </Tabs.List>
      <Tabs.Panel value="image" className="contents">
        {imageElement}
      </Tabs.Panel>
      <Tabs.Panel value="video" className="contents">
        {videoElement}
      </Tabs.Panel>
    </Tabs.Root>
  );
}
