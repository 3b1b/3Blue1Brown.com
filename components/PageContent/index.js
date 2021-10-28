import {
  useContext,
  Fragment,
  Children,
  cloneElement,
  isValidElement,
} from "react";
import { MDXRemote } from "next-mdx-remote";
import Section from "../Section";
import Footnote from "../Footnote";
import components from "../";
import { PageContext } from "../../pages/_app";

// render main content of mdx file (in props.source and props.content) to react
const PageContent = () => {
  const { source, content } = useContext(PageContext);

  // if markdown file doesn't start with section, wrap with section
  // allows authors to not include any sections and get their mdx auto-wrapped
  let Wrapper = Fragment;
  if (!content.trim().startsWith("<Section")) {
    Wrapper = WrapWithSection;
  }

  if (!source) return null;
  return (
    <Wrapper>
      <MDXRemote
        {...source}
        components={{ ...components, wrapper: MDXWrapper }}
      />
    </Wrapper>
  );
};

function WrapWithSection({ children }) {
  return <Section width="narrow">{children}</Section>;
}

export default PageContent;

/*
  We are using MDXWrapper in a hacky way to customize the way tooltips appear
  by manipulating the react children directly.
*/

function MDXWrapper({ children }) {
  let footnotesComponent = null;

  Children.forEach(children, (child) => {
    if (child.props.className === "footnotes") {
      footnotesComponent = child;
    }
  });

  if (!footnotesComponent) return <div>{children}</div>;

  let footnotesOl = null;
  Children.forEach(footnotesComponent.props.children, (child) => {
    if (child.props.mdxType === "ol") {
      footnotesOl = child;
    }
  });

  if (!footnotesOl) {
    console.error(
      "Unexpected dom layout: Footnotes div didn't contain an <ol>."
    );
    return <div>{children}</div>;
  }

  const footnotes = Children.toArray(footnotesOl.props.children);
  const links = getFootenoteLinks(children);

  // `footnotes` and `links` should correspond 1-to-1
  // So now we can replace each link with a tooltip containing
  // the footnote content.
  let mapping = new Map();
  for (let i = 0; i < links.length; i++) {
    const link = links[i];
    const footnote = footnotes[i];

    const label = Children.only(link.props.children).props.children;
    const content = replaceChildren(footnote.props.children, (child) => {
      if (child.props && child.props.className === "footnote-backref") {
        return null;
      }
      return undefined;
    });

    mapping.set(links[i], <Footnote label={label}>{content}</Footnote>);
  }

  mapping.set(footnotesComponent, null);

  return (
    <div>
      {replaceChildren(children, (child) => {
        if (mapping.has(child)) return mapping.get(child);
        return undefined;
      })}
    </div>
  );
}

function getFootenoteLinks(children) {
  let links = [];

  Children.forEach(children, (child) => {
    if (typeof child === "string") return;

    // Expect footnote links to look like this:
    // <sup id="fnref-N"><a className="footnote-ref">N</a></sup>
    if (
      child.props.mdxType === "sup" &&
      child.props.id.startsWith("fnref-") &&
      Children.count(child.props.children) === 1 &&
      Children.only(child.props.children).props.className === "footnote-ref"
    ) {
      // If it's a match, add the <sup> element to `links`.
      links.push(child);
      return;
    }

    links.push(...getFootenoteLinks(child.props.children));
  });

  return links;
}

function replaceChildren(children, mapping) {
  return Children.map(children, (child) => {
    const mapped = mapping(child);
    if (mapped !== undefined) {
      return mapped;
    }

    if (!isValidElement(child)) return child;

    if (Children.count(child.props.children) === 0) return child;

    return cloneElement(child, {
      ...child.props,
      children: replaceChildren(child.props.children, mapping),
    });
  });
}
