import { mapEntries } from "~/util/misc";
import { slugify } from "~/util/string";

// wrapper for importing and using bulk assets
export const importAssets = <Import, Transformed = Import>(
  // a passed import.meta.glob<SomeType>() w/ eager: true
  imports: Record<string, Import>,
  // if filename is this, use parent folder name as asset name instead
  base = "index",
  // optional transform to apply to each import before returning
  transform: (module: Import, name: string, path: string) => Transformed = (
    module,
  ) => module as unknown as Transformed,
) => {
  // create map of name to import and original path
  const map = mapEntries(imports, (path, module) => [
    slugify(nameFromPath(path, base)),
    { path, module },
  ]);

  // look up single import by name
  const getOne = (name: string): Transformed | undefined => {
    name = slugify(name);
    const item = map[name];
    if (!item) return;
    const { path, module } = item;
    return transform(module, name, path);
  };

  // get all imports
  const all = mapEntries(map, (name, { path, module }) => [
    name,
    transform(module, name, path),
  ]);

  return [getOne, all] as const;
};

// wrapper for lazy importing and using bulk assets
export const importAssetsAsync = <Import, Transformed = Import>(
  // a passed import.meta.glob<SomeType>()
  imports: Record<string, () => Promise<Import>>,
  // if filename this, use parent folder instead of filename as asset name
  base = "index",
  // optional transform to apply to each import before returning
  transform: (module: Import, name: string, path: string) => Transformed = (
    module,
  ) => module as unknown as Transformed,
) => {
  // map of asset name to import and original path
  const map = mapEntries(imports, (path, module) => [
    slugify(nameFromPath(path, base)),
    { path, module },
  ]);

  // cache promises so use() receives stable resource per asset
  // https://react.dev/reference/react/use#caveats
  const cache: Record<string, Promise<Transformed | undefined>> = {};

  // look up single asset by name
  const getOne = (name: string): Promise<Transformed | undefined> => {
    name = slugify(name);

    cache[name] ??= (async () => {
      const item = map[name];
      if (!item) return;
      const { path, module } = item;
      return transform(await module(), name, path);
    })();

    return cache[name]!;
  };

  return getOne;
};

// turn full path into name based on file or folder name
const nameFromPath = (path: string, base = "index") => {
  // split path into parts
  const parts = path.split("/");
  // filename w/ ext
  const filename = parts.pop() ?? "";
  // filename w/o ext
  const name = filename?.split(".").slice(0, -1).join(".") ?? "";
  // if file name is base, use parent folder name instead
  if (name === base) return parts.pop() ?? "";
  else return name;
};
