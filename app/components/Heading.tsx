import type { ComponentProps, JSX, ReactNode } from "react";
import { useRef } from "react";
import Link from "~/components/Link";
import { renderText } from "~/util/dom";
import { slugify } from "~/util/string";

type Props = {
  // "indent" level
  level: 1 | 2 | 3 | 4;
  // manually set anchor link instead of automatically from children text
  anchor?: string;
  // heading content
  children: ReactNode;
} & ComponentProps<"h1" | "h2" | "h3" | "h4">;

export default function Heading({ level, anchor, children, ...props }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  // heading tag
  const Tag: keyof JSX.IntrinsicElements = `h${level}`;

  // url-compatible, "slugified" id
  const id = anchor ?? slugify(renderText(children));

  return (
    <Tag id={id} ref={ref} {...props}>
      <Link to={"#" + id} className="contents! text-black no-underline">
        {children}
      </Link>
    </Tag>
  );
}
