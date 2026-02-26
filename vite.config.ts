import { fileURLToPath } from "url";
import mdx from "@mdx-js/rollup";
import viteYaml from "@modyfi/vite-plugin-yaml";
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

export default defineConfig({
  plugins: [
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
    viteYaml(),
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
