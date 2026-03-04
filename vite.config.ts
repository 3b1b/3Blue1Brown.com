import { fileURLToPath } from "url";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import replace from "vite-plugin-filter-replace";
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import site from "./app/data/site.json";

export default defineConfig({
  optimizeDeps: {
    exclude: ["better-react-mathjax"],
  },
  plugins: [
    replace([
      {
        filter: /\.mdx$/,
        replace(source, path) {
          // get relevant part of lesson path
          let lesson =
            path.match(new RegExp("(lessons/20\\d\\d/.*)/index.mdx"))?.[1] ??
            "";
          // prepend bucket location
          lesson = `${site.bucket}/${lesson}`;
          // inject lesson variable into source
          source = source.replace("$lesson", lesson);
          return source;
        },
      },
    ]),
    mdx({
      remarkPlugins: [
        remarkFrontmatter,
        remarkMdxFrontmatter,
        remarkMath,
        remarkGfm,
      ],
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
