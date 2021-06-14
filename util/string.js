// convert string to dash case suitable for urls
export const toDashCase = (string) =>
  string
    .split(/\s|\W/)
    .filter((e) => e)
    .join("-")
    .toLowerCase();
