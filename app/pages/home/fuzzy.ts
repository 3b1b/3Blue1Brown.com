import { expose } from "comlink";
import Fuse from "fuse.js";

// fuzzy search list of entries
export const search = <Entry extends Record<string, unknown>>(
  list: Entry[],
  search: string,
  keys: string[],
) => {
  // init searcher
  const searcher = new Fuse<Entry>(list, {
    keys,
    threshold: 0.2,
    ignoreLocation: true,
  });
  // return search results
  return searcher.search(search).map(({ item }) => item);
};

expose({ search });
