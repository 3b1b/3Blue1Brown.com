const toggleToc = () => {
  const toc = document.querySelector(".toc");
  if (toc.dataset.open) toc.removeAttribute("data-open");
  else toc.setAttribute("data-open", true);
  toc.querySelector("[data-active]").scrollIntoView({ block: "center" });
};
