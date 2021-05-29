// expand/collapse patron list
const togglePatrons = (button) => {
  const patrons = document.querySelector(".patrons");
  if (patrons.dataset.open === "true") {
    patrons.dataset.open = false;
    button.querySelector(".clickable_icon i").className = "fas fa-angle-down";
    button.querySelector(".clickable_text").innerHTML = "See More";
  } else {
    patrons.dataset.open = true;
    button.querySelector(".clickable_icon i").className = "fas fa-angle-up";
    button.querySelector(".clickable_text").innerHTML = "See Less";
  }
};
