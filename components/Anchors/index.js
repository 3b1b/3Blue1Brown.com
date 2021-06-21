import { useEffect } from "react";

// singleton component to create clickable anchors next to headings, and add ids
// to headings without them. include this before table of contents so it gets
// all headings
const Anchors = () => {
  // run anchors script once after page load
  useEffect(() => {
    createAnchors();
  }, []);

  return null;
};

export default Anchors;

// anchors script
const createAnchors = () => {
  // remove any existing anchors (should only happen with local hot reloading)
  document.querySelectorAll(".anchor").forEach((anchor) => anchor.remove());

  // get headings
  const headings = document.querySelectorAll("h1, h2, h3, h4");

  // process each heading
  for (const heading of headings) {
    // make anchor
    const link = document.createElement("a");
    link.classList.add("anchor");
    link.setAttribute("href", "#" + heading.getAttribute("id"));
    link.innerHTML = "<i class='fas fa-link' />";
    heading.append(link);
  }

  // TO DO: add anchors next to any element with an id attr, like figures
};
