import { useEffect } from "react";
import { slugify } from "~/util/string";

export default function Anchors() {
  // do this client-only to easily be isomorphic (i.e. work across mdx, react components, etc.)
  useEffect(() => {
    // get all headings on page
    const headings = document.querySelectorAll("h1, h2, h3, h4");
    // process each heading
    for (const heading of headings) {
      // skip if already has link
      if (heading.querySelector("a")) continue;
      // get id
      const id = heading.id
        ? heading.id
        : (heading.id = slugify(heading.textContent));
      // create link
      const link = document.createElement("a");
      // link to id
      link.href = `#${id}`;
      // add heading contents within link
      link.replaceChildren(...heading.childNodes);
      // add styles
      link.className = "contents text-current no-underline";
      // add link to heading
      heading.replaceChildren(link);
    }
  }, []);

  return null;
}
