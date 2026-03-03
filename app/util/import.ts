import { slugify } from "~/util/string";

// wrapper for importing and using bulk assets
export const importAssets = <Import, Transformed = Import>(
  // a passed import.meta.glob<Type>() w/ eager: true
  imports: Record<string, Import>,
  // if filename this, use parent folder instead of filename as asset name
  base = "index",
  // optional transform to apply to each import before returning
  transform: (name: string, path: string, _import: Import) => Transformed = (
    name,
    path,
    _import,
  ) => _import as unknown as Transformed,
) => {
  // create map of name to import
  const list = Object.fromEntries(
    Object.entries(imports).map(([path, _import]) => {
      const name = slugify(nameFromPath(path, base));
      const transformedImport = transform(name, path, _import);
      return [name, transformedImport] as const;
    }),
  );

  return [
    // look up import by slug-ified name
    (name: string) => list[slugify(name)],
    // list all imports
    list,
  ] as const;
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
