import type { RefObject } from "react";
import type { searchList, setList } from "~/util/fuzzy";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { flushSync } from "react-dom";
import {
  useDebounce,
  useElementBounding,
  useEventListener,
  useWindowSize,
} from "@reactuses/core";
import { wrap } from "comlink";
import { isEqual, mapValues, random } from "lodash-es";
import { UAParser } from "ua-parser-js";
import { celebrate } from "~/components/Celebrate";
import FuzzyWorker from "~/util/fuzzy?worker";
import { frame, sleep } from "~/util/misc";
import { Vector } from "~/util/vector";

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

// use search results with instant exact matches and async fuzzy matches
export const useFuzzySearch = <Entry extends Record<string, unknown>>(
  list: Entry[],
  _search: string,
  onSearch?: (search: string) => void,
) => {
  // debounce to avoid excessive work
  const search = useDebounce(_search.trim(), 300);

  // callback
  useEffect(() => {
    onSearch?.(search);
  }, [search, onSearch]);

  const client = useClient();

  // create web worker thread
  const worker = useMemo(
    () =>
      client
        ? wrap<{
            searchList: typeof searchList<Entry>;
            setList: typeof setList<Entry>;
          }>(new FuzzyWorker())
        : undefined,
    [client],
  );

  const [matches, setMatches] = useState<Entry[]>([]);

  // set search list when input list changes
  useEffect(() => {
    if (!worker) return;
    worker.setList(list);
  }, [worker, list]);

  // re-search when search changes
  useEffect(() => {
    if (!worker) return;
    let latest = true;

    (async () => {
      if (!search) return setMatches(list);
      const matches = await worker.searchList(search);
      if (!latest) return;
      setMatches(matches);
    })();

    return () => {
      latest = false;
    };
  }, [worker, search, list]);

  return matches;
};

// scroll "progress" of element down viewport, -1 to 1
export const useParallax = (ref: RefObject<Element | null>) => {
  const elementBbox = useElementBounding(ref);
  const windowSize = useWindowSize();
  const percent =
    (elementBbox.top + elementBbox.height / 2) / windowSize.height;
  return -1 + 2 * percent || 0;
};

// is element in viewport
export const useInView = (ref: RefObject<Element | null>) => {
  const elementBbox = useElementBounding(ref);
  const windowSize = useWindowSize();

  // if on server or otherwise don't have sizes
  if (
    !windowSize.height ||
    !windowSize.width ||
    !elementBbox.width ||
    !elementBbox.height
  )
    return false;

  return (
    elementBbox.bottom > 0 &&
    elementBbox.top < windowSize.height &&
    elementBbox.right > 0 &&
    elementBbox.left < windowSize.width
  );
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

// ???
export const useEgg = () => {
  useEffect(() => {
    (async () => {
      const today = new Date();
      let shape = "";
      if (today.getMonth() + 1 === 3 && today.getDate() === 14) shape = "pi";
      if (today.getMonth() + 1 === 6 && today.getDate() === 28) shape = "tau";
      // shape = "pi";
      if (!shape) return;
      const width = window.innerWidth / 2;
      const height = window.innerHeight / 2;
      for (let bursts = 20; bursts > 0; bursts--) {
        celebrate(
          shape,
          new Vector(random(-width, width), random(-height, height)),
        );
        await sleep(250);
      }
      await sleep(500);
      celebrate(shape, new Vector(0, 0), 3);
    })();
  }, []);
};
