import type { ComponentProps } from "react";
import { useRef } from "react";
import { useFullscreen } from "@reactuses/core";
import clsx from "clsx";
import { renderText } from "~/util/dom";

type Props = {
  image: string;
  alt?: string;
  children?: string;
} & ComponentProps<"figure">;

export default function Image({ image, alt, children, className }: Props) {
  const ref = useRef<HTMLImageElement>(null);

  // set alt from children
  if (!alt && children) alt = renderText(children);

  // fullscreen control
  const [isFullscreen, { toggleFullscreen }] = useFullscreen(ref);

  // image element
  const img = (
    <img
      ref={ref}
      src={image}
      alt={alt}
      tabIndex={0}
      onClick={toggleFullscreen}
      onKeyDown={({ key }) => {
        if (key === "Enter" || key === " ") toggleFullscreen();
      }}
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
    <figure className={clsx("flex flex-col items-center gap-4", className)}>
      {img}
      {children && (
        <figcaption className="text-dark-gray italic">{children}</figcaption>
      )}
    </figure>
  );
}
