import { fileURLToPath } from "url";
import mdx from "@mdx-js/rollup";
import ViteYaml from "@modyfi/vite-plugin-yaml";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [mdx(), tailwindcss(), reactRouter(), tsconfigPaths(), ViteYaml()],
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
  },
});
