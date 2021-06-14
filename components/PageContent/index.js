import { useContext } from "react";
import { MDXRemote } from "next-mdx-remote";
import components from "../";
import { PageContext } from "../../pages/_app";

// render main content of mdx file (in props.source and props.content) to react
const PageContent = () => {
  const { source } = useContext(PageContext);
  if (!source) return <></>;
  return <MDXRemote {...source} components={components} />;
};

export default PageContent;
