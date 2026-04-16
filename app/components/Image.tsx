import type { ComponentProps, ReactNode } from "react";
import { useRef } from "react";
import { useFullscreen, useMergedRefs } from "@reactuses/core";
import clsx from "clsx";

type Props = {
  // image source
  image: string;
  // alt text for accessibility
  alt?: string;
  // caption content
  children?: ReactNode;
} & ComponentProps<"img">;

// plain image or figure with caption
export default function Image({
  ref: passedRef,
  image,
  alt = "",
  children,
  className,
  ...props
}: Props) {
  const localRef = useRef<HTMLImageElement>(null);
  const mergedRef = useMergedRefs(localRef, passedRef);

  // fullscreen control
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(localRef);

  // image element
  const img = (
    <img
      ref={mergedRef}
      src={image}
      alt={alt || "Image"}
      tabIndex={0}
      onClick={toggleFullscreen}
      onKeyDown={({ key }) => {
        if (key === "Enter" || key === " ") toggleFullscreen();
      }}
      aria-label={isFullscreen ? "Exit fullscreen" : "View image in fullscreen"}
      className={clsx(
        "cursor-pointer break-inside-avoid",
        isFullscreen && "object-contain!",
        !children && className,
      )}
      {...props}
    />
  );

  // if no caption, just img
  if (!children) return img;

  // if caption, figure and figcaption
  return (
    <figure className={clsx("flex flex-col items-center gap-4", className)}>
      {img}
      {children && (
        <figcaption className="self-center text-gray">{children}</figcaption>
      )}
    </figure>
  );
}
