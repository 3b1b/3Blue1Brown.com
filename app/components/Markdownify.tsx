import type { ReactNode } from "react";
import ReactMarkdown from "react-markdown";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";

type Props = {
  children: ReactNode;
  noParagraph?: boolean;
};

// plain string to markdown
export default function Markdownify({ children, noParagraph = false }: Props) {
  if (typeof children !== "string") return children;

  return (
    <ReactMarkdown
      components={noParagraph ? { p: "span" } : {}}
      remarkPlugins={[remarkMath]}
      rehypePlugins={[rehypeKatex]}
    >
      {children}
    </ReactMarkdown>
  );
}
