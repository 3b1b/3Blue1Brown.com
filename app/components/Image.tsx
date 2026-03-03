import type { ComponentProps } from "react";
import { useRef } from "react";
import { useFullscreen } from "@reactuses/core";
import clsx from "clsx";

type Props = {
  image: string;
  alt?: string;
  children?: string;
} & ComponentProps<"figure">;

// plain image or figure with caption
export default function Image({ image, alt = "", children, className }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  // fullscreen control
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(ref);

  // image element
  const img = (
    <img
      ref={ref}
      src={image}
      alt={alt || "Image"}
      tabIndex={0}
      onClick={toggleFullscreen}
      onKeyDown={({ key }) => {
        if (key === "Enter" || key === " ") toggleFullscreen();
      }}
      aria-label={isFullscreen ? "Exit fullscreen" : "View image in fullscreen"}
      className={clsx(
        "cursor-pointer",
        isFullscreen && "object-contain!",
        !children && className,
      )}
    />
  );

  // if no caption, just img
  if (!children) return img;

  // if caption, figure and figcaption
  return (
    <figure className={clsx("flex flex-col gap-4", className)}>
      {img}
      {children && (
        <figcaption className="self-center text-dark-gray italic">
          {children}
        </figcaption>
      )}
    </figure>
  );
}
