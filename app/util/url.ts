import type { To } from "react-router";
import { resolvePath } from "react-router";

// string to signify that param should be removed from url search
export const deleteParam = "undefined";

// combine url search params. keep all old keys (except explicitly deleted), add new keys (overwriting).
const mergeSearch = (from = "", to = "") => {
  const fromSearch = new URLSearchParams(from);
  const toSearch = new URLSearchParams(to);
  for (const [key, value] of toSearch) {
    if (value === deleteParam) fromSearch.delete(key);
    else fromSearch.set(key, value);
  }
  return fromSearch;
};

// combine urls, preserving parts where appropriate
export const mergeTo = (from: To, to: To) => {
  // normalize to path instead of string
  from = resolvePath(from);
  to = resolvePath(to);

  // preserve parts of url
  const path = {
    // use old path unless new one defined or to root
    pathname:
      to.pathname !== "/" || (to.pathname === "/" && !to.search && !to.hash)
        ? to.pathname
        : from.pathname,
    search: "?" + mergeSearch(from.search, to.search),
    // keep old hash unless new one defined. always use new if path changed.
    hash: to.hash || to.pathname !== from.pathname ? to.hash : from.hash,
  };

  return path;
};
