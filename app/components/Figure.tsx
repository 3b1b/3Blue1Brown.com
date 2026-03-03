import { Tabs } from "@base-ui/react";
import { ImageIcon, VideoIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import Button from "~/components/Button";
import Image from "~/components/Image";

type Props = {
  image?: string;
  video?: string;
  show?: "image" | "video";
  loop?: boolean;
  children?: string;
  className?: string;
};

// combination image/video
export default function Figure({
  image,
  video,
  show,
  loop,
  children,
  className,
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

  // if only one or the other, just show that one
  if (image && !video) return imageElement;
  if (video && !image) return videoElement;

  // if neither, show nothing
  if (!image && !video) return null;

  // tab button
  const Tab: Tabs.Tab.Props["render"] = (props, state) => (
    <Button {...props} color={state.active ? "light" : undefined} />
  );

  // if both, show tabs
  return (
    <Tabs.Root className="flex flex-col items-center gap-4" defaultValue={show}>
      <Tabs.List className="flex items-center gap-4">
        <Tabs.Tab value="image" render={Tab}>
          <ImageIcon />
          Image
        </Tabs.Tab>
        <Tabs.Tab value="video" render={Tab}>
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
