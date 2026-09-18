import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import { omit } from "lodash-es";
import remarkMath from "remark-math";
import Footnote from "~/components/Footnote";
import { H1, H2, H3, H4 } from "~/components/Heading";
import Link from "~/components/Link";
import Quote from "~/components/Quote";

type Props = {
  // don't wrap in paragraphs, which can cause unwanted spacing
  noParagraph?: boolean;
  // markdown content
  children: ReactNode;
};

// render markdown string to html elements. avoid using if possible, instead use
// children prop which automatically gets converted via build plugins.
export default function Markdownify({ noParagraph = true, children }: Props) {
  if (typeof children !== "string") return children;

  return (
    <ReactMarkdown
      components={
        // eslint-disable-next-line -- not actually react hook despite starting with "use"
        useMDXComponents(noParagraph)
      }
      remarkPlugins={[remarkMath]}
    >
      {children}
    </ReactMarkdown>
  );
}

// replace plain markdown elements with other elements/components
// used in both markdownify runtime component and buildtime mdx rollup plugin
// https://mdxjs.com/packages/mdx
export const useMDXComponents = (noParagraph?: boolean): Components => ({
  // section
  section: (props) => {
    // turn footnotes section into different tag to not interfere with alternating section colors
    if ("data-footnotes" in props)
      // visually hide
      return (
        <aside
          {...omit(props, "node")}
          className="sr-only"
          aria-label="Footnotes"
        />
      );
    return <section {...omit(props, "node")} />;
  },

  // h1
  h1: (props) => <H1 {...omit(props, "node")} />,

  // h2
  h2: (props) => {
    // remove footnote heading to remove from table of contents
    if (props.id === "footnote-label") return null;
    return <H2 {...omit(props, "node")} />;
  },

  // h3
  h3: (props) => <H3 {...omit(props, "node")} />,

  // h4
  h4: (props) => <H4 {...omit(props, "node")} />,

  p: (props) => {
    // render paragraphs as spans to avoid unwanted spacing
    if (noParagraph) return <span {...omit(props, "node")} />;
    return <p {...omit(props, "node")} />;
  },

  // links
  a: (props) => {
    const { href = "", children = <></>, ...rest } = props;
    // replace footnote reference
    if ("data-footnote-ref" in props)
      return <Footnote {...omit(props, "node")} />;
    // replace with our link component
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  },

  // quote
  blockquote: (props) => {
    const { children = <></>, ...rest } = props;
    // replace with our quote component
    return <Quote {...rest}>{children}</Quote>;
  },
});
