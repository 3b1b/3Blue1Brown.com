import { useElementBounding, useWindowSize } from "@reactuses/core";
import type { RefObject } from "react";

// scroll "progress" of element as % down viewport
export const useScroll = (ref: RefObject<HTMLElement | null>) => {
  const elementBbox = useElementBounding(ref);
  const windowSize = useWindowSize();
  return (elementBbox.top + elementBbox.height / 2) / windowSize.height;
};
