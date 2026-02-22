import { fileURLToPath } from "url";
import mdx from "@mdx-js/rollup";
import viteYaml from "@modyfi/vite-plugin-yaml";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import rehypeKatex from "rehype-katex";
import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { defineConfig } from "vite";
import { imagetools } from "vite-imagetools";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    mdx({
      remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
    viteYaml(),
    imagetools(),
  ],
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
});
