import NextLink from "next/link";

// replaces mdx link to allow relative links on same domain
// https://github.com/syntax-tree/mdast#link
const Link = ({ href = "", children = "" }) => (
  <NextLink href={href}>
    <a>{children}</a>
  </NextLink>
);

export default Link;
