import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

// needed for eslint and mdx vscode extension to correctly parse mdx
export default {
  plugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkMath],
};
