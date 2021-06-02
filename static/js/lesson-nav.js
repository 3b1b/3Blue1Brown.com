// expand or collapse lesson topic table of contents
const toggleLessonNav = (button) => {
  const lessonNav = button.closest(".lesson_nav");
  if (lessonNav.dataset.open === "true") {
    lessonNav.dataset.open = false;
    button.dataset.tooltip = "Open lesson list";
    button.querySelector("i").className = "fas fa-ellipsis-h";
  } else {
    lessonNav.dataset.open = true;
    button.dataset.tooltip = "Close lesson list";
    button.querySelector("i").className = "fas fa-times";
  }
  lessonNav
    .querySelector("[data-active='true']")
    .scrollIntoView({ block: "center" });
};
