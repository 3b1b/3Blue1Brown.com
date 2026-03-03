import { relative, sep } from "path";
import { fileURLToPath } from "url";
import type { PluginOption } from "vite";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import rehypeKatex from "rehype-katex";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import site from "./app/data/site.json";

// simple plugin to do string replacement in mdx files
const mdxReplace: PluginOption = {
  name: "inject-mdx-path",
  transform(code, path) {
    // skip non-mdx files
    if (!path.endsWith(".mdx")) return null;
    // path of current file, relative to repo root
    path = relative(process.cwd(), path);
    const parts = path.split(sep);
    // list of replacements
    const replacements = {
      $lesson: [site.bucket, ...parts.slice(-4, -1)].join(sep),
    };
    for (const [key, value] of Object.entries(replacements))
      code = code.replaceAll(key, value);

    return { code };
  },
};

export default defineConfig({
  plugins: [
    mdxReplace,
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkMath,
        remarkGfm,
      ],
      rehypePlugins: [rehypeKatex],
      // https://mdxjs.com/packages/mdx
      providerImportSource: "~/components/Markdownify",
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    svgr({
      svgrOptions: {
        // https://github.com/gregberge/svgr/discussions/770
        expandProps: "start",
        svgProps: {
          className: `{props.className ? props.className + " icon" : "icon"}`,
        },
      },
    }),
    imagetools(),
  ],
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
});
