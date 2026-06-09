import type * as FuzzyAPI from "./fuzzy";
import { useEffect, useMemo, useState } from "react";
import { useDebounce } from "@reactuses/core";
import { wrap } from "comlink";
import { random } from "lodash-es";
import { celebrate } from "~/components/Celebrate";
import { sleep } from "~/util/async";
import { useClient } from "~/util/hooks";
import { Vector } from "~/util/vector";
import FuzzyWorker from "./fuzzy?worker";

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
    () => (client ? wrap<typeof FuzzyAPI>(new FuzzyWorker()) : undefined),
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
      const matches = (await worker.searchList(search)) as Entry[];
      if (!latest) return;
      setMatches(matches);
    })();

    return () => {
      latest = false;
    };
  }, [worker, search, list]);

  return matches;
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
      for (let bursts = 20; bursts > 0; bursts--) {
        celebrate(shape, new Vector(random(-1, 1, true), random(-1, 1, true)));
        await sleep(250);
      }
      await sleep(500);
      celebrate(shape, new Vector(0, 0), 1);
    })();
  }, []);
};
