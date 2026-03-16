import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
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

// avoid using if possible. instead use children prop which automatically
// gets converted via build plugins.

// plain string to markdown
export default function Markdownify({ noParagraph = false, children }: Props) {
  if (typeof children !== "string") return children;

  return (
    <ReactMarkdown
      components={
        // not actually a react hook despite starting with "use"
        // eslint-disable-next-line
        useMDXComponents(noParagraph)
      }
      remarkPlugins={[remarkMath]}
    >
      {children}
    </ReactMarkdown>
  );
}

// replace components, in both markdownify runtime component and buildtime mdx rollup plugin
// https://mdxjs.com/packages/mdx
export const useMDXComponents = (noParagraph?: boolean): Components => ({
  // section
  section: (props) => {
    // turn footnotes section into different element to not interfere with alternating section colors
    if ("data-footnotes" in props) return <aside {...props} />;
    return <section {...props} />;
  },

  // h1
  h1: (props) => <H1 {...props} />,

  // h2
  h2: (props) => {
    // remove footnote heading to remove from table of contents
    if (props.id === "footnote-label") return null;
    return <H2 {...props} />;
  },

  // h3
  h3: (props) => <H3 {...props} />,

  // h4
  h4: (props) => <H4 {...props} />,

  p: (props) => {
    // render paragraphs as spans to avoid unwanted spacing
    if (noParagraph) return "span";
    return <p {...props} />;
  },

  // links
  a: (props) => {
    const { href = "", children = <></>, ...rest } = props;
    // replace footnote reference
    if ("data-footnote-ref" in props) return <Footnote {...props} />;
    return (
      <Link to={href} {...rest}>
        {children}
      </Link>
    );
  },

  // quote
  blockquote: (props) => {
    const { children = <></>, ...rest } = props;
    return <Quote {...rest}>{children}</Quote>;
  },
});
