import { useElementBounding, useWindowSize } from "@reactuses/core";
import type { RefObject } from "react";

// scroll "progress" of element down viewport, -1 to 1
export const useParallax = (ref: RefObject<HTMLElement | null>) => {
  const elementBbox = useElementBounding(ref);
  const windowSize = useWindowSize();
  const percent =
    (elementBbox.top + elementBbox.height / 2) / windowSize.height;
  return -1 + 2 * percent;
};
