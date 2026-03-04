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
    pathname: to.pathname || from.pathname,
    search: "?" + mergeSearch(from.search, to.search),
    hash: to.hash || from.hash,
  };

  return path;
};

// share current page
export const share = async () => {
  try {
    await window.navigator.share({
      url: window.location.href,
      text: document.title,
    });
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") return;
    console.error(error);
    await window.navigator.clipboard.writeText(window.location.href);
    window.alert("Link copied to clipboard!");
  }
};
