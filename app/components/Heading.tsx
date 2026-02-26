import type { JSX, ReactNode } from "react";
import { Children, isValidElement, useEffect, useRef } from "react";
import { deepFind, deepMap, getElementName } from "react-children-utilities";
import { atom, useSetAtom } from "jotai";
import Link from "~/components/Link";
import { renderText } from "~/util/dom";
import { slugify } from "~/util/string";

type Props = {
  // "indent" level
  level: 1 | 2 | 3 | 4;
  // explicit id
  id?: string;
  // class on heading
  className?: string;
  // heading content
  children?: ReactNode;
};

type Heading = {
  // ref
  element: HTMLHeadingElement;
  // id
  id: string;
  // "indent" level
  level: number;
  // simplified content for table of contents
  content: ReactNode;
};

// global list of headings
export const headingsAtom = atom<Heading[]>([]);

function Heading({ level, id, className, children }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  // heading tag
  const Tag: keyof JSX.IntrinsicElements = `h${level}`;

  // if no explicit id, generate from content
  id ??= getId(children);

  // set global list of headings
  const setHeadings = useSetAtom(headingsAtom);

  useEffect(() => {
    const element = ref.current;

    if (element)
      // add heading to list
      setHeadings((headings) => {
        // find position to insert
        const position =
          headings.findLastIndex(
            (heading) =>
              heading.element.compareDocumentPosition(element) &
              Node.DOCUMENT_POSITION_FOLLOWING,
          ) + 1;

        // this heading
        const heading = {
          element,
          id,
          level,
          content: getContent(children),
        };

        // insert at correct position
        headings.splice(position, 0, heading);

        return headings;
      });

    return () => {
      // remove heading from list
      setHeadings((headings) =>
        headings.filter((heading) => heading.element !== element),
      );
    };
  }, [id, children, level, setHeadings]);

  return (
    <Tag id={id} ref={ref} className={className}>
      <Link to={"#" + id} className="contents! text-current no-underline">
        {children}
      </Link>
    </Tag>
  );
}

type HeadingLevel = Omit<Props, "level">;

export function H1(props: HeadingLevel) {
  return <Heading level={1} {...props} />;
}

export function H2(props: HeadingLevel) {
  return <Heading level={2} {...props} />;
}

export function H3(props: HeadingLevel) {
  return <Heading level={3} {...props} />;
}

export function H4(props: HeadingLevel) {
  return <Heading level={4} {...props} />;
}

// get id from content
const getId = (content: ReactNode) =>
  slugify(
    renderText(
      deepMap(content, (node) => {
        // if math root element, replace with just annotation child
        if (isMathElement(node)) {
          const annotation = deepFind(
            node,
            (node) => getElementName(node) === "annotation",
          );
          if (annotation) return renderText(annotation);
        }

        // otherwise, render as normal
        return node;
      }),
    ),
  );

// get simplified content for table of contents
const getContent = (content: ReactNode) =>
  Children.map(content, (node) => {
    if (isMathElement(node)) return node;
    return renderText(node);
  });

// is node a root math element node
const isMathElement = (node: ReactNode) =>
  isValidElement(node) &&
  typeof node.props === "object" &&
  node.props !== null &&
  "className" in node.props &&
  node.props.className === "katex";
