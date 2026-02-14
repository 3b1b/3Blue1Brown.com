import { expose } from "comlink";
import Fuse from "fuse.js";

// fuzzy search instance
let searcher = new Fuse<unknown>([]);

// set list to search through
export const setList = <Entry extends Record<string, unknown>>(
  list: Entry[],
) => {
  // search all top level keys
  const keys = [...new Set(list.flatMap((entry) => Object.keys(entry)))];
  // re-init searcher
  searcher = new Fuse(list, { keys, threshold: 0.2 });
};

// execute search
export const searchList = <Entry extends Record<string, unknown>>(
  search: string,
) => searcher.search<Entry>(search).map(({ item }) => item);

expose({ setList, searchList });
