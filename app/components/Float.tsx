import type { ReactNode } from "react";
import { useEffect, useRef } from "react";
import { useElementSize, useWindowSize } from "@reactuses/core";
import clsx from "clsx";

type Props = {
  // whether to flip to right side instead of left
  flip?: boolean;
  // content to float
  children: ReactNode;
};

// spacing between element and section content
const spacing = 40;

// "float" a piece of content left/right outside of a section
export default function Float({ flip, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  // child element
  const childRef = useRef<Element>(null);
  // parent section element
  const sectionRef = useRef<Element>(null);

  // get associated elements
  useEffect(() => {
    childRef.current = ref.current?.firstElementChild ?? null;
    sectionRef.current = ref.current?.closest("section") ?? null;
  }, []);

  // measure widths
  const { width: windowWidth } = useWindowSize();
  const [sectionWidth] = useElementSize(sectionRef);
  const [elementWidth] = useElementSize(childRef);

  // available width in margins
  const availableWidth = (windowWidth - sectionWidth) / 2;

  // inline mode
  const inline = elementWidth + 2 * spacing > availableWidth;

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
        ref={ref}
        className={inline ? "contents" : "relative w-fit"}
        style={{
          translate: inline
            ? undefined
            : flip
              ? `calc(100% + ${spacing}px) 0`
              : `calc(-100% - ${spacing}px) 0`,
        }}
      >
        {children}
      </div>
    </div>
  );
}
