import type { RefObject } from "react";
import { useCallback, useEffect, useLayoutEffect, useState } from "react";
import { flushSync } from "react-dom";
import {
  useElementBounding,
  useEventListener,
  useWindowSize,
} from "@reactuses/core";
import { isEqual, mapValues } from "lodash-es";
import { UAParser } from "ua-parser-js";
import { frame } from "~/util/async";

// check if value changed from previous render
export const useChanged = <Value>(
  value: Value,
  // if false, doesn't trigger on first change from undefined to defined
  countUndefined = true,
) => {
  const [prev, setPrev] = useState<Value>();
  const changed = !isEqual(prev, value);
  if (changed) setPrev(value);
  return changed && (countUndefined || prev !== undefined);
};

// how much element is in view, in [-1,1]
export const useHowMuchInView = (ref: RefObject<Element | null>) => {
  const element = useElementBounding(ref);
  const window = useWindowSize();

  // if on server or otherwise don't have sizes
  if (!window.height || !window.width || !element.width || !element.height)
    return [0, 0] as const;

  // how much element is in view, in [-1,1]
  // -1 when top of element @ bottom of view, 1 when bottom of element @ top of view
  return [
    -1 + (2 * (window.width - element.left)) / (window.width + element.width),
    -1 + (2 * (window.height - element.top)) / (window.height + element.height),
  ] as const;
};

// is element in viewport at all
export const useInView = (ref: RefObject<Element | null>) => {
  const [x, y] = useHowMuchInView(ref);
  return Math.abs(x) < 1 && Math.abs(y) < 1;
};

// has element ever been in viewport
export const useBeenInView = (ref: RefObject<Element | null>) => {
  const inView = useInView(ref);
  const [value, setValue] = useState(inView);
  if (inView && !value) setValue(true);
  return value;
};

// fit svg view box to content
export const useSvgFit = (ref: RefObject<SVGSVGElement | null>) => {
  // run fit
  const fit = useCallback(() => {
    if (!ref.current) return;
    // get bbox of contents
    const { x, y, width, height } = ref.current.getBBox();
    // fit view to contents
    ref.current.setAttribute("viewBox", [x, y, width, height].join(" "));
  }, [ref]);

  // run fit after every render
  useLayoutEffect(() => {
    fit();
  });

  return fit;
};

// use user agent info
export const useUA = () => {
  // parse user agent string
  const ua =
    typeof window === "undefined"
      ? undefined
      : // (if on client)
        new UAParser(window.navigator.userAgent).getResult();

  const isFirefox = ua?.browser.name?.toLowerCase().includes("firefox");

  const isSafari = ua?.browser.name?.toLowerCase().includes("safari");

  // https://github.com/faisalman/ua-parser-js/issues/182
  const isDesktop = !ua?.device.type;

  // combine user agent info into convenient list
  const userAgent = mapValues(
    {
      Browser: [ua?.browser.name, ua?.browser.version],
      Engine: [ua?.engine.name, ua?.engine.version],
      OS: [ua?.os.name, ua?.os.version],
      Device: [ua?.device.type, ua?.device.model, ua?.device.vendor],
      CPU: [ua?.cpu.architecture],
    },
    (value) => value.filter(Boolean).join(" "),
  );

  return { userAgent, isFirefox, isSafari, isDesktop };
};

// are we on client or ssr'ing
export const useClient = () => {
  const [client, setClient] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line -- https://github.com/facebook/react/issues/34045#issuecomment-3801067128
    setClient(true);
  }, []);

  return client;
};

// control expanding/collapsing height of element with transition
export const useAutoHeight = (
  ref: RefObject<HTMLElement | null>,
  // is open
  open: boolean,
  // closed height
  closed = 0,
) => {
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;

    // reset height so content can size naturally
    const reset = () => (element.style.maxHeight = "");

    if (open) {
      // set height to content height
      element.style.maxHeight = element.scrollHeight + "px";
      // reset after transition
      element.addEventListener("transitionend", reset, { once: true });
    } else {
      // set starting height
      element.style.maxHeight = element.scrollHeight + "px";
      frame().then(() => {
        // collapse
        element.style.maxHeight = closed + "px";
      });
    }

    return () => {
      element.removeEventListener("transitionend", reset);
    };
  }, [ref, open, closed]);
};

// use printing state
export const usePrinting = () => {
  const [printing, setPrinting] = useState(false);
  // set printing state and synchronously render
  useEventListener("beforeprint", () => flushSync(() => setPrinting(true)));
  useEventListener("afterprint", () => flushSync(() => setPrinting(false)));
  return printing;
};
