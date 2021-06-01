// generate table of contents for lesson
const createToc = () => {
  // get panel
  const toc = document.querySelector(".toc .toc_list");

  // if no panel, not on lesson page
  if (!toc) return;

  // loop through headings
  const headings = document.querySelectorAll("h1[id], h2[id], h3[id], h4[id]");
  for (const heading of headings) {
    // make toc link for each heading
    const link = document.createElement("a");
    link.href = "#" + heading.getAttribute("id");
    link.innerHTML = heading.innerHTML;
    link.classList.add("toc_link");
    link.classList.add("truncate");
    link.dataset.level = Number(heading.tagName.replace(/\D/g, ""));
    toc.append(link);
  }
};

// open toc panel
const openToc = () => {
  const toc = document.querySelector(".toc");
  if (!toc) return;
  toc.dataset.open = true;
  toc.querySelector(".toc_close").tabIndex = 0;
  toc.querySelector(".toc_open").tabIndex = -1;
  toc.querySelector(".toc_open").blur();
};

// close toc panel
const closeToc = () => {
  const toc = document.querySelector(".toc");
  if (!toc) return;
  toc.dataset.open = false;
  toc.querySelector(".toc_close").tabIndex = -1;
  toc.querySelector(".toc_close").blur();
  toc.querySelector(".toc_open").tabIndex = 0;
};

// show open button only when below top of page
const hideOpenButton = () => {
  const top = document.querySelector("main > section:nth-child(3)");
  const toc = document.querySelector(".toc_open");
  if (!top || !toc) return;
  toc.style.opacity = top.getBoundingClientRect().top < 0 ? 1 : 0;
};

// start script
window.addEventListener("DOMContentLoaded", createToc);
window.addEventListener("DOMContentLoaded", closeToc);
window.addEventListener("DOMContentLoaded", hideOpenButton);
window.addEventListener("scroll", hideOpenButton);
