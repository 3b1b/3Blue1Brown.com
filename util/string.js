// convert string to dash case suitable for urls
export const toDashCase = (string = "") =>
  String(string)
    .split(/\s|\W/)
    .filter((e) => e)
    .join("-");
