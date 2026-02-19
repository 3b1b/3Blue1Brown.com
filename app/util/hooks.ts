import type { RefObject } from "react";
import type { searchList, setList } from "~/util/fuzzy";
import { useEffect, useMemo, useState } from "react";
import {
  useDebounce,
  useElementBounding,
  useWindowSize,
} from "@reactuses/core";
import { wrap } from "comlink";
import { isEqual } from "lodash-es";
import FuzzyWorker from "~/util/fuzzy?worker";

// check if value changed from previous render
export const useChanged = <Value>(value: Value, countUndefined = true) => {
  const [prev, setPrev] = useState<Value>();
  const changed = !isEqual(prev, value);
  if (changed) setPrev(value);
  return changed && (countUndefined || prev !== undefined);
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

// scroll "progress" of element down viewport, -1 to 1
export const useParallax = (ref: RefObject<HTMLElement | null>) => {
  const elementBbox = useElementBounding(ref);
  const windowSize = useWindowSize();
  const percent =
    (elementBbox.top + elementBbox.height / 2) / windowSize.height;
  return -1 + 2 * percent || 0;
};
