import { slugify } from "~/util/string";

// wrapper for importing and using bulk assets
export const importAssets = <Import>(
  imports: Record<string, Import>,
  base = "index",
) => {
  // create map of name to import
  const list = Object.fromEntries(
    Object.entries(imports).map(
      ([path, module]) => [slugify(nameFromPath(path, base)), module] as const,
    ),
  ) as Record<string, Import>;

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
  // use parent folder name
  if (name === base) return parts.pop() ?? "";
  else return name;
};
