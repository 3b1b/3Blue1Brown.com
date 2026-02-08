import type { JSX, ReactNode } from "react";
import { useRef } from "react";
import Link from "~/components/Link";
import { renderText } from "~/util/dom";
import { slugify } from "~/util/string";

type Props = {
  // "indent" level
  level: 1 | 2 | 3 | 4;
  // manually set anchor link instead of automatically from children text
  anchor?: string;
  // class on heading
  className?: string;
  // heading content
  children: ReactNode;
};

export default function Heading({ level, anchor, className, children }: Props) {
  const ref = useRef<HTMLHeadingElement>(null);

  // heading tag
  const Tag: keyof JSX.IntrinsicElements = `h${level}`;

  // url-compatible, "slugified" id
  const id = anchor ?? slugify(renderText(children));

  return (
    <Tag id={id} ref={ref} className={className}>
      <Link
        to={"#" + id}
        className="
          contents! text-black no-underline
          hover:text-theme
        "
      >
        {children}
      </Link>
    </Tag>
  );
}
