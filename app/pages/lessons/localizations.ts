import _localizations from "~/pages/lessons/localizations.json";

const localizations = _localizations as Record<
  string,
  Record<string, { title: string; description: string }>
>;

export const getLocalization = (lessonId: string, languageCode: string) =>
  localizations[lessonId]?.[languageCode];
