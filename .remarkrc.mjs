import remarkFrontmatter from "remark-frontmatter";
import remarkMath from "remark-math";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

// needed for eslint to correctly parse mdx
export default {
  plugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkMath],
};
