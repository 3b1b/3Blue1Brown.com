import ReactMarkdown from "react-markdown";
import remarkMath from "remark-13-math";
import rehypeKatex from "rehype-katex";

// latest version of react-markdown only supports remark 13
// latest version of mdx only supports remark 12
// thus, have separate 12 and 13 remark versions of remark-math
// use 13 for this component, 12 for everything else (mdx)

const Markdownify = ({ children }) => {
  if (typeof children === "string") {
    // hack to convert string character escape sequences back into their 
    // original raw strings, e.g. a tab gets converted to a literal "\t"
    children = JSON.stringify(children).slice(1,-1)
    return (
      <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
        {children}
      </ReactMarkdown>
    );
  } else return <>{children}</>;
};

export default Markdownify;
