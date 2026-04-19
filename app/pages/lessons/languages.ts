import { mapValues } from "lodash-es";
import _languages from "~/data/languages.json";
import _indexJson from "~/pages/lessons/language-index.json";

const _index = _indexJson as Partial<Record<string, string[]>>;

export const languages = mapValues(_languages, (lang, code) => ({
  code,
  title: lang.title,
  lessons: _index[code] ?? ([] as string[]),
}));

export type LanguageCode = keyof typeof languages;
