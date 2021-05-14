// show still or animated version of figure
const figureShow = (button, show) => {
  const figure = button.closest(".figure");
  figure.dataset.show = show;
  figure
    .querySelectorAll("button")
    .forEach((button) => (button.dataset.active = false));
  button.dataset.active = true;
};
