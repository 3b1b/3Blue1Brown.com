import type { ComponentProps } from "react";
import { useEffect, useState } from "react";
import Tooltip from "~/components/Tooltip";

type Props = ComponentProps<"a">;

// custom footnote component to replace markdown footnote links
export default function Footnote({ href, children }: Props) {
  // popup content
  const [content, setContent] = useState("");

  // on page load
  useEffect(() => {
    // get footnotes section
    const section = document.querySelector<HTMLElement>(
      "section[data-footnotes='true']",
    );
    if (!section) return;
    // hide footnotes section
    section.classList.add("sr-only");
    if (!href) return;
    // get footnote content element
    const target = document.querySelector(href);
    if (!target) return;
    // clone footnote content
    const clone = target.cloneNode(true) as HTMLElement;
    clone.querySelector("[data-footnote-backref]")?.remove();
    // eslint-disable-next-line
    setContent(clone.innerHTML);
  }, [href]);

  return (
    <Tooltip trigger={<button className="badge size-4">{children}</button>}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </Tooltip>
  );
}
