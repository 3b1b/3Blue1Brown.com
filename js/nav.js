// expand/collapse nav bar in header on mobile
const toggleNav = (button) => {
  const nav = button.closest("nav");
  if (nav.dataset.expanded === "true") {
    nav.dataset.expanded = false;
    button.querySelector("i").className = "fas fa-bars";
  } else {
    nav.dataset.expanded = true;
    button.querySelector("i").className = "fas fa-times";
  }
};
