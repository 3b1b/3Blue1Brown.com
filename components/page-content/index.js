import { MDXRemote } from "next-mdx-remote";
import Section from "../section";
import components from "../";

// render main content of mdx file (in props.source and props.content) to react
const PageContent = (props) => (
  <MDXRemote {...props.source} components={components} />
);

export default PageContent;
