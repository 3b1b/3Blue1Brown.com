/** make string url-safe */
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]+/g, " ")
    .replaceAll(/\s+/g, " ")
    .trim()
    .replaceAll(" ", "-");
