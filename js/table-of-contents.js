// expand or collapse lesson topic table of contents
const toggleToc = (button) => {
  const toc = button.closest(".toc");
  if (toc.dataset.open === "true") {
    toc.dataset.open = false;
    button.dataset.tooltip = "Open lesson list";
    button.querySelector("i").className = "fas fa-list-ul";
  } else {
    toc.dataset.open = true;
    button.dataset.tooltip = "Close lesson list";
    button.querySelector("i").className = "fas fa-times";
  }
  toc.querySelector("[data-active]").scrollIntoView({ block: "center" });
};
