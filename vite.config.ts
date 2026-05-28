import { fileURLToPath } from "url";
import type { Root } from "mdast";
import type { Plugin } from "vite";
import mdx from "@mdx-js/rollup";
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import remarkFrontmatter from "remark-frontmatter";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";
import { visit } from "unist-util-visit";
import { defineConfig } from "vite";
import svgr from "vite-plugin-svgr";
import site from "./app/data/site.json";

export default defineConfig(() => ({
  // uncomment if cold-start refresh gets annoying
  // https://github.com/vitejs/vite/discussions/14801
  // optimizeDeps: {
  //   noDiscovery: command === "serve",
  //   include: [],
  // },

  plugins: [
    textReplacePlugin,
    mdxPlugin,
    tailwindcss(),
    reactRouter(),
    svgrPlugin,
  ],
  resolve: {
    alias: { "~": fileURLToPath(new URL("./app", import.meta.url)) },
    tsconfigPaths: true,
  },
}));

// transform source code as raw string
const textReplacePlugin: Plugin = {
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
          path.match(new RegExp("(lessons/20[0-9][0-9]/.*)/index.mdx"))?.[1] ??
          "";
        // prepend bucket location
        lesson = `${site.gcp.bucket}/${lesson}`;
        // inject lesson variable into source
        source = source.replaceAll("$lesson", lesson);
      }
    }

    return source;
  },
};

// edit structure of mdx ast before transforming to jsx (editing react fiber structure is more brittle)
const editMDX = () => (tree: Root) => {
  // remove spurious child paragraphs added by mdx
  // https://github.com/mdx-js/mdx/issues/1798
  // https://jasongerbes.com/blog/mdx-remove-unwanted-paragraph-tags
  visit(tree, "mdxJsxFlowElement", (node) => {
    if (["p", "a", "button", "Link", "Button"].includes(node.name || ""))
      node.children = node.children.flatMap((child) =>
        // @ts-expect-error `visit` narrows `node` to `MdxJsxFlowElement` for dev convenience, but in practice mdast runtime can handle node/children being changed to any valid node
        child.type === "paragraph" ? child.children : [child],
      );
  });
};

// support importing mdx and transforming to jsx
const mdxPlugin = mdx({
  remarkPlugins: [
    remarkFrontmatter,
    remarkMdxFrontmatter,
    remarkMath,
    remarkGfm,
    editMDX,
  ],
  // https://mdxjs.com/packages/mdx
  providerImportSource: "~/components/Markdownify",
});

// allow importing and inlining svgs as react components
const svgrPlugin = svgr({
  svgrOptions: {
    // https://github.com/gregberge/svgr/discussions/770
    expandProps: "start",
    svgProps: {
      className: `{props.className ? props.className + " icon" : "icon"}`,
    },
  },
});
