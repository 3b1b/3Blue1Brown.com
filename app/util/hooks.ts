import {
  useDebounce,
  useElementBounding,
  useWindowSize,
} from "@reactuses/core";
import type { RefObject } from "react";
import type { NavigateOptions, To } from "react-router";
import { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { isEqual } from "lodash-es";
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
