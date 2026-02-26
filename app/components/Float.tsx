import type { ReactNode } from "react";
import { useRef } from "react";
import { useElementSize, useWindowSize } from "@reactuses/core";
import clsx from "clsx";

type Props = {
  flip?: boolean;
  children: ReactNode;
};

// space between element and section/view
const space = 40;

// "float" a piece of content left/right outside of a section
export default function Float({ flip, children }: Props) {
  // child element
  const childRef = useRef<Element>(null);
  // parent section element
  const sectionRef = useRef<Element>(null);

  // measure widths
  const { width: windowWidth } = useWindowSize();
  const [sectionWidth] = useElementSize(sectionRef);
  const [elementWidth] = useElementSize(childRef);

  // available width in margins
  const availableWidth = (windowWidth - sectionWidth) / 2;

  // inline mode
  const inline = elementWidth + 2 * space > availableWidth;

  return (
    <div
      className={
        inline
          ? "contents"
          : clsx(
              "-my-8 flex h-0 w-full",
              flip ? "justify-end" : "justify-start",
            )
      }
    >
      <div
        ref={(el) => {
          childRef.current = el?.firstElementChild as Element | null;
          sectionRef.current = el?.closest("section") ?? null;
        }}
        className={inline ? "contents" : "relative w-fit"}
        style={{
          translate: inline
            ? undefined
            : flip
              ? `calc(100% + ${space}px) 0`
              : `calc(-100% - ${space}px) 0`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
