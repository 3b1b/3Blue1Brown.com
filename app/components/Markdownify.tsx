import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import Footnote from "~/components/Footnote";

type Props = {
  children: ReactNode;
  noParagraph?: boolean;
};

// avoid using if possible. instead use children prop which automatically
// gets converted via build setup.

// plain string to markdown
export default function Markdownify({ children, noParagraph = false }: Props) {
  if (typeof children !== "string") return children;

  return (
    <ReactMarkdown
      components={
        // not actually a react hook despite starting with "use"
        // eslint-disable-next-line
        useMDXComponents(noParagraph)
      }
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {children}
    </ReactMarkdown>
  );
}

// replace components
// https://mdxjs.com/packages/mdx
export const useMDXComponents = (noParagraph?: boolean): Components => ({
  // render paragraphs as spans to avoid unwanted spacing
  ...(noParagraph ? { p: "span" } : {}),

  // links
  a: (props) => {
    // replace footnote reference
    if ("data-footnote-ref" in props) return <Footnote {...props} />;
    return <a {...props} />;
  },
});
