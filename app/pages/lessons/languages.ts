import { mapValues } from "lodash-es";
import _languages from "~/data/languages.json";
import _index from "~/pages/lessons/language-index.json";

const index = _index as Record<string, string[]>;

export const languages = mapValues(_languages, ({ title }, code) => ({
  code,
  title,
  lessons: index[code] ?? [],
}));

export type LanguageCode = keyof typeof languages;
