// show still or animated version of figure
const figureShow = (button, show) => {
  const figure = button.closest(".figure");
  figure.dataset.show = show;
  figure
    .querySelectorAll("button")
    .forEach((button) => (button.dataset.active = false));
  button.dataset.active = true;
};

// autoplay video when figure and video come into view
const createAutoplays = () => {
  const videos = document.querySelectorAll(".figure video");
  for (const video of videos)
    new IntersectionObserver(videoInView).observe(video);
};

// when element comes into view
let videoInView = (entries) => {
  for (const { target, isIntersecting } of entries) {
    if (isIntersecting) target.play();
    else target.pause();
  }
};

// start script
window.addEventListener("DOMContentLoaded", createAutoplays);
