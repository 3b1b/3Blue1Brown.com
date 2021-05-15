// expand/collapse nav bar in header on mobile
const toggleNav = (button) => {
  const nav = button.closest("nav");
  if (nav.dataset.open === "true") {
    nav.dataset.open = false;
    button.querySelector("i").className = "fas fa-bars";
  } else {
    nav.dataset.open = true;
    button.querySelector("i").className = "fas fa-times";
  }
};
