import type { ReactNode } from "react";
import type { Components } from "react-markdown";
import { useEffect } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import Footnote from "~/components/Footnote";
import { H1, H2, H3, H4 } from "~/components/Heading";
import Link from "~/components/Link";
import Quote from "~/components/Quote";

type Props = {
  children: ReactNode;
  noParagraph?: boolean;
};

// avoid using if possible. instead use children prop which automatically
// gets converted via build setup.

// plain string to markdown
export default function Markdownify({ children, noParagraph = false }: Props) {
  // https://github.com/KaTeX/KaTeX/discussions/3819
  useEffect(() => {
    document.querySelectorAll("annotation").forEach((element) => {
      const content = element.textContent ?? "";
      const root = element.closest(".katex");
      root?.setAttribute("aria-label", content);
      root?.setAttribute("role", "img");
    });
  }, []);

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

// replace components, in both markdownify runtime component and buildtime mdx rollup plugin
// https://mdxjs.com/packages/mdx
export const useMDXComponents = (noParagraph?: boolean): Components => ({
  // render paragraphs as spans to avoid unwanted spacing
  ...(noParagraph ? { p: "span" } : {}),

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

  // quote
  blockquote: (props) => {
    const { children = <></>, ...rest } = props;
    return <Quote {...rest}>{children}</Quote>;
  },
});
