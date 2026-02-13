import { mapKeys, mapValues } from "lodash-es";

// import all svgs in this folder
const imports = import.meta.glob<{ default: string }>("./*.svg", {
  eager: true,
});

// map from filename (w/o extension) to import svg url
export let images = mapValues(imports, (_import) => _import.default);
images = mapKeys(
  images,
  (_, path) => path.split("/").slice(-1)[0]?.split(".")[0] ?? "",
);
