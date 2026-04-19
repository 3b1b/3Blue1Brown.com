import _localizations from "~/pages/lessons/localizations.json";

type Entry = { title: string; description: string };

const localizations = _localizations as Record<string, Record<string, Entry>>;

export const getLocalization = (lessonId: string, languageCode: string) =>
  localizations[lessonId]?.[languageCode];
