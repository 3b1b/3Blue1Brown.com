import type { ComponentProps } from "react";
import Tooltip from "~/components/Tooltip";

type Props = ComponentProps<"a">;

// custom footnote component to replace markdown footnote links
export default function Footnote({ href, children }: Props) {
  return (
    <Tooltip trigger={<button className="badge size-4">{children}</button>}>
      <div
        ref={(div) => {
          if (!div || !href) return;
          // get footnote content element
          const target = document.querySelector(href);
          if (!target) return;
          // clone footnote content
          const clone = target.cloneNode(true) as HTMLElement;
          clone.querySelector("[data-footnote-backref]")?.remove();
          div.innerHTML = clone.innerHTML;
        }}
      />
    </Tooltip>
  );
}
