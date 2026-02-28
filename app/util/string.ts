// make string url-safe
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}]+/gu, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
    .replaceAll(" ", "-");

// format date
export const formatDate = (date?: string | number | Date | null) => {
  if (!date) return "-";
  return new Date(date).toLocaleDateString(undefined, { dateStyle: "medium" });
};

// shorten url text
export const shortenUrl = (value: string) => {
  try {
    const url = new URL(value);
    return (url.hostname + url.pathname).replace(/\/+$/, "");
  } catch (error) {
    return value;
  }
};
