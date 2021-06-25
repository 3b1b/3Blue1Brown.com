import { useContext, Fragment } from "react";
import { MDXRemote } from "next-mdx-remote";
import Section from "../Section";
import components from "../";
import { PageContext } from "../../pages/_app";

// render main content of mdx file (in props.source and props.content) to react
const PageContent = () => {
  const { source, content } = useContext(PageContext);

  // if markdown file doesn't start with section, wrap with section
  // allows authors to not include any sections and get their mdx auto-wrapped
  let Wrapper = Fragment;
  if (!content.trim().startsWith("<Section")) {
    Wrapper = ({ children }) => <Section width="narrow">{children}</Section>;
  }

  if (!source) return null;
  return (
    <Wrapper>
      <MDXRemote {...source} components={components} />
    </Wrapper>
  );
};

export default PageContent;
