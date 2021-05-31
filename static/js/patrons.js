// expand/collapse patron list
const togglePatrons = (button) => {
  const patrons = button.previousElementSibling;
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

// shuffle patrons in lesson
const shufflePatrons = () => {
  const patrons = document.querySelector(".patrons[data-shuffle='true']");
  for (let child = patrons.children.length; child >= 0; child--)
    patrons.appendChild(patrons.children[Math.floor(Math.random() * child)]);
};

// shuffle patrons on page load
window.addEventListener("DOMContentLoaded", shufflePatrons);
