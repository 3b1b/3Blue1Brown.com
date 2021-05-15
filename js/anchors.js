// creates clickable icon next to each heading that links to that section

// create section links next to each heading 1 through 4 that have unique ids
const createAnchors = () => {
  // for each heading
  const headings = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id]");
  for (const heading of headings) {
    // create anchor link
    const link = document.createElement("a");
    link.classList.add("fas", "fa-link", "anchor");
    link.href = "#" + heading.id;
    heading.append(link);

    // if first heading in the section, move id from heading to parent section
    if (heading.matches(":first-child")) {
      let section = heading.closest("section");
      if (section) {
        section.id = heading.id;
        heading.removeAttribute("id");
      }
    }
  }
};

// glow section when user navigates to it
const onHashChange = () => {
  const id = window.location.hash.replace("#", "");
  let element = document.getElementById(id);
  if (!element) return;
  glowElement(element);
};

// start script and add triggers
window.addEventListener("load", createAnchors);
window.addEventListener("load", onHashChange);
window.addEventListener("hashchange", onHashChange);
