import NextLink from "next/link";

// https://github.com/syntax-tree/mdast#link
const Link = ({ href = "", children = "" }) => (
  <NextLink href={href}>
    <a>{children}</a>
  </NextLink>
);

export default Link;
