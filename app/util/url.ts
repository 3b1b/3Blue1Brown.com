// string to signify that param should be removed from url search
export const deleteParam = "";

// combine url search params. keep all old keys (except explicitly deleted), add new keys (overwriting).
export const mergeSearch = (from = "", to = "") => {
  const fromSearch = new URLSearchParams(from);
  const toSearch = new URLSearchParams(to);
  for (const [key, value] of toSearch) {
    if (value === deleteParam) fromSearch.delete(key);
    else fromSearch.set(key, value);
  }
  return `?${fromSearch.toString()}`;
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

// shorten url text
export const shorten = (value: string) => {
  try {
    const url = new URL(value);
    return (url.hostname + url.pathname).replace(/\/+$/, "");
  } catch (error) {
    return value;
  }
};
