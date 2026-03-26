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
import svgr from "vite-plugin-svgr";
import tsconfigPaths from "vite-tsconfig-paths";
import site from "./app/data/site.json";

export default defineConfig({
  plugins: [
    // custom plugin, transform source code as raw string
    {
      name: "text-replace",
      enforce: "pre",
      transform(source, path) {
        // parse path as url
        const { pathname, searchParams } = new URL(path, import.meta.url);

        // process mdx files
        if (pathname.includes(".mdx")) {
          // if frontmatter exists
          if (source.startsWith("---")) {
            // split into frontmatter and content
            const [, frontmatter = "", content = ""] =
              source.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)/) ?? [];

            // reconstruct source
            source = [
              "---",
              frontmatter,
              // append extras to frontmatter
              `read: ${!!content.trim()}`,
              "---",
              searchParams.has("frontmatter-only") ? "" : content,
            ].join("\n");
          }

          // replace $lesson var
          if (source.includes("$lesson")) {
            // get relevant part of lesson path
            let lesson =
              path.match(new RegExp("(lessons/20\\d\\d/.*)/index.mdx"))?.[1] ??
              "";
            // prepend bucket location
            lesson = `${site.bucket}/${lesson}`;
            // inject lesson variable into source
            source = source.replaceAll("$lesson", lesson);
          }
        }

        return source;
      },
    },
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
