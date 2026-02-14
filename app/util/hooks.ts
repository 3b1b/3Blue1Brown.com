import {
  useDebounce,
  useElementBounding,
  useWindowSize,
} from "@reactuses/core";
import type { RefObject } from "react";
import type { NavigateOptions, To } from "react-router";
import type { searchList, setList } from "~/util/fuzzy";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { wrap } from "comlink";
import { isEqual } from "lodash-es";
import FuzzyWorker from "~/util/fuzzy?worker";
import { mergeTo } from "~/util/url";

// scroll "progress" of element down viewport, -1 to 1
export const useParallax = (ref: RefObject<HTMLElement | null>) => {
  const elementBbox = useElementBounding(ref);
  const windowSize = useWindowSize();
  const percent =
    (elementBbox.top + elementBbox.height / 2) / windowSize.height;
  return -1 + 2 * percent || 0;
};

// check if value changed from previous render
export const useChanged = <Value>(value: Value, countUndefined = true) => {
  const [prev, setPrev] = useState<Value>();
  const changed = !isEqual(prev, value);
  if (changed) setPrev(value);
  return changed && (countUndefined || prev !== undefined);
};

// alternative to react-router func of same name, with extra conveniences
export const useSearchParams = (debounce = 1000, options?: NavigateOptions) => {
  // current location
  const location = useLocation();

  // current search params
  const search = new URLSearchParams(location.search);

  // programmatic nav
  const navigate = useNavigate();

  // next location to nav to
  const [next, setNext] = useState<To>();

  // set search params
  const set = useCallback(
    (func: (prev: URLSearchParams) => void) => {
      // copy to new object to trigger re-render
      const search = new URLSearchParams(location.search);
      // let func mutate directly
      func(search);
      // merge with current location to preserve other parts of url
      setNext(mergeTo(location, { search: "?" + search }));
    },
    [location],
  );

  // debounce next nav location to avoid excessive browser history entries
  const debounced = useDebounce(next, debounce);

  // when next nav location settles, finally navigate
  useEffect(() => {
    if (debounced)
      navigate(debounced, { preventScrollReset: true, ...options });
  }, [debounced, navigate, options]);

  return [search, set] as const;
};

// use search results with instant exact matches and async fuzzy matches
export const useFuzzySearch = <Entry extends Record<string, unknown>>(
  list: Entry[],
  _search: string,
) => {
  // debounce to avoid excessive work
  const search = useDebounce(_search.trim(), 300);

  // create web worker thread
  const worker = useMemo(
    () =>
      typeof Worker !== "undefined"
        ? wrap<{
            searchList: typeof searchList<Entry>;
            setList: typeof setList<Entry>;
          }>(new FuzzyWorker())
        : undefined,
    [],
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
