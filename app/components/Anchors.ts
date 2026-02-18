import { useEffect } from "react";
import { slugify } from "~/util/string";

// turn all anchors into links
export default function Anchors() {
  useEffect(() => {
    const elements = document.querySelectorAll("h1, h2, h3, h4");

    // process each heading
    for (const element of elements) {
      // skip if already has link
      if (element.querySelector("a")) continue;
      // get id
      const id = element.id
        ? element.id
        : (element.id = slugify(element.textContent));
      // create link
      const link = document.createElement("a");
      // link to id
      link.href = `#${id}`;
      // add element contents within link
      link.replaceChildren(...element.childNodes);
      // add styles
      link.className = "contents text-current no-underline";
      // add link to element
      element.replaceChildren(link);
    }
  }, []);

  return null;
}
