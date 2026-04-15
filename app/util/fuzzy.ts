import { expose } from "comlink";
import Fuse from "fuse.js";

// fuzzy search instance
// eslint-disable-next-line
let searcher = new Fuse<any>([]);

// set list to search through
export const setList = <Entry extends Record<string, unknown>>(
  list: Entry[],
) => {
  // search all top level keys
  const keys = [...new Set(list.flatMap((entry) => Object.keys(entry)))];
  // re-init searcher
  searcher = new Fuse(list, { keys, threshold: 0.2, ignoreLocation: true });
};

// execute search
export const searchList = <Entry extends Record<string, unknown>>(
  search: string,
) => (searcher as Fuse<Entry>).search(search).map(({ item }) => item);

expose({ setList, searchList });
