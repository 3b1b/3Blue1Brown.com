// expand or collapse lesson topic table of contents
const toggleToc = (button) => {
  const toc = button.closest(".toc");
  if (toc.dataset.open) {
    toc.removeAttribute("data-open");
    button.querySelector("i").className = "fas fa-list-ul";
  } else {
    toc.setAttribute("data-open", true);
    button.querySelector("i").className = "fas fa-times";
  }
  toc.querySelector("[data-active]").scrollIntoView({ block: "center" });
};
