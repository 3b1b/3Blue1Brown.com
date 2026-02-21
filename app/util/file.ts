import { fromPairs, toPairs } from "lodash-es";
import { slugify } from "~/util/string";

// helper wrapper for importing and using bulk assets
export const importAssets = (imports: Record<string, { default: string }>) => {
  // create map of filename to import url
  const list = fromPairs(
    toPairs(imports).map(
      ([path, module]) => [getFilename(path), module.default] as const,
    ),
  );

  return {
    // look up import by name
    lookUp: (name: string) => list[slugify(name)],
    // list all imports
    list,
  };
};

// get filename without extension from path
export const getFilename = (path: string) =>
  path.split("/").pop()?.split(".")[0] ?? "";
