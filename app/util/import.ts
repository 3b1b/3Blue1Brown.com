import { fromPairs, toPairs } from "lodash-es";
import { slugify } from "~/util/string";

// helper wrapper for importing and using bulk assets
export const importAssets = (imports: Record<string, { default: string }>) => {
  // create map of filename to import url
  const imageLookup = fromPairs(
    toPairs(imports).map(
      ([path, module]) =>
        [path.split("/").pop()?.split(".")[0] ?? "", module.default] as const,
    ),
  );

  // lookup import by name
  return (name: string) => imageLookup[slugify(name)];
};
