import type { ReactNode } from "react";
import { Children, useEffect, useState } from "react";
import { CaretLeftIcon, CaretRightIcon } from "@phosphor-icons/react";
import clsx from "clsx";
import useEmblaCarousel from "embla-carousel-react";
import { range } from "lodash-es";
import Button from "~/components/Button";

type Props = {
  // slides content. each child becomes separate slide.
  children: ReactNode;
};

export default function Carousel({ children }: Props) {
  const [ref, api] = useEmblaCarousel({ loop: false, duration: 10 });

  // actions
  const goToPrev = () => api?.goToPrev();
  const goToNext = () => api?.goToNext();
  const goTo = (index: number) => api?.goTo(index);

  // active slide index
  const [active, setActive] = useState(0);

  // listen for slide change
  useEffect(() => {
    api?.on("select", () => setActive(api.selectedSnap()));
  }, [api]);

  return (
    <div className="relative isolate flex flex-col items-center gap-4">
      <div className="overflow-x-hidden border" ref={ref}>
        <div className="flex [touch-action:pan-y_pinch-zoom]">
          {Children.map(children, (child, index) => (
            <div
              key={index}
              className="flex shrink-0 grow-0 basis-full items-center justify-center"
            >
              {child}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center">
        <Button size="sm" onClick={goToPrev} aria-label="Previous slide">
          <CaretLeftIcon />
        </Button>
        {range(Children.count(children)).map((index) => (
          <Button
            key={index}
            onClick={() => goTo(index)}
            className={clsx(index !== active && "opacity-25")}
            aria-label={`Go to slide ${index + 1}`}
          >
            <svg viewBox="-1 -1 2 2" className="size-2">
              <circle r={1} fill="currentColor" />
            </svg>
          </Button>
        ))}
        <Button size="sm" onClick={goToNext} aria-label="Next slide">
          <CaretRightIcon />
        </Button>
      </div>
    </div>
  );
}
