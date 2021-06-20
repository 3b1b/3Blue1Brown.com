import { useEffect } from "react";

// singleton component to create clickable anchors next to headings, and add ids
// to headings without them. include this before table of contents so it gets
// all headings
const Anchors = () => {
  // run anchors script once after page load
  useEffect(() => {
    createAnchors();
  }, []);

  return <></>;
};

export default Anchors;

// anchors script
const createAnchors = () => {
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
};
