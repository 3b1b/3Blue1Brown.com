import { useEffect } from "react";
import { atom } from "jotai";
import { setAtom } from "~/util/atom";
import { slugify } from "~/util/string";

type Heading = {
  // unique id (slugified from text)
  id: string;
  // heading level (1-4)
  level: number;
  // original element
  element: Element;
  // clone of element for table of contents
  clone: Element;
};

// global list of headings
export const headingsAtom = atom<Heading[]>([]);

// process all headings on page, on client load, from raw dom

export default function Headings() {
  // do this client-only to easily be isomorphic (i.e. work across mdx, react components, etc.)
  useEffect(() => {
    // get all headings on page
    const elements = document.querySelectorAll("h1, h2, h3, h4");
    // process each heading
    for (const element of elements) {
      const heading = element as Element;
      // skip if already has link
      if (heading.querySelector("a")) continue;
      // get level
      const level = parseInt(heading.tagName.slice(1));
      // get id
      const id = heading.id ? heading.id : (heading.id = getId(heading));
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
      // keep track of heading
      setAtom(headingsAtom, (headings) => [
        ...headings,
        { id, level, element: heading, clone: getClone(link) },
      ]);
    }
  });

  return null;
}

// alternative strategy:
//
// make a heading component to use in place of h1-h4 everywhere
// adds itself to global combined list of headings instead of scraping dom
// in tsx, use component directly as normal
// in mdx, inject component so ####s auto-replaced
//
// pros:
// heading setup (adding link, making id, etc.) more simple and idiomatic w/ declarative jsx
// handles reactive changes (we don't need this in our case)
//
// cons:
// needs extra setup to work across contexts
// more annoying for authoring
// more verbose

// get id from heading content
const getId = (heading: Element) => {
  const text: string[] = [];

  for (const child of heading.childNodes) {
    // special handling for math
    if (child instanceof Element && child.classList.contains("katex"))
      text.push(child.querySelector("annotation")?.textContent || "");
    else text.push(child.textContent || "");
  }

  return slugify(text.join(" "));
};

// get clone of heading content for table of contents
const getClone = (heading: Element) => {
  const clone = heading.cloneNode(true) as Element;

  for (const child of clone.childNodes) {
    // special handling for math
    if (child instanceof Element && child.classList.contains("katex")) continue;
    // replace child with text node of textContent
    child.replaceWith(document.createTextNode(child.textContent || ""));
  }

  return clone;
};
