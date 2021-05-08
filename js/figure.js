// show still or animated version of figure
const figureShow = (button, mode) => {
  const figure = button.closest(".figure");
  figure.dataset.show = mode;
  figure
    .querySelectorAll("button")
    .forEach((button) => (button.dataset.active = false));
  button.dataset.active = true;
};
