import PropTypes from "prop-types";
import ReactMarkdown from "react-markdown";
import remarkMath from "remark-13-math";
import rehypeKatex from "rehype-katex";

// latest version of react-markdown only supports remark 13
// latest version of mdx only supports remark 12
// thus, have separate 12 and 13 remark versions of remark-math
// use 13 for this component, 12 for everything else (mdx)

Markdownify.propTypes = {
  children: PropTypes.node.isRequired,
  noParagraph: PropTypes.bool,
};

// component to turn plain string into markdown, useful for making components
// accept markdown as props
export default function Markdownify({ children, noParagraph = false }) {
  if (typeof children === "string") {
    return (
      <ReactMarkdown
        components={noParagraph ? { p: "span" } : {}}
        remarkPlugins={[remarkMath]}
        rehypePlugins={[rehypeKatex]}
      >
        {children}
      </ReactMarkdown>
    );
  } else return children;
}
