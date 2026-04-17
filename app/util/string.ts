// format number to string
export const formatNumber = (value?: number, compact = true) =>
  (value || 0).toLocaleString(undefined, {
    notation: compact ? "compact" : undefined,
  });

// make string url-safe
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replaceAll(/[^\p{L}\p{N}]+/gu, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
    .replaceAll(" ", "-");

// parse date
export const parseDate = (string: string) => {
  const date = new Date(string + "T00:00:00");
  if (isNaN(date.getTime())) return undefined;
  return date;
};

// format date
export const formatDate = (date: Date | undefined) =>
  date ? date.toLocaleDateString(undefined, { dateStyle: "medium" }) : "-";
