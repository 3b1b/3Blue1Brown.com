export const toDashCase = (string) =>
  string
    .split(/\s/)
    .filter((p) => p)
    .join("-")
    .toLowerCase();
