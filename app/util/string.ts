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

// format date
export const formatDate = (date?: string | number | Date | null) => {
  if (!date) return "-";
  date = new Date(date);
  // ignore timezone for consistent formatting
  date.setHours(0, 0, 0, 0);
  return date.toLocaleDateString(undefined, { dateStyle: "medium" });
};
