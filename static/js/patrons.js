// expand/collapse patron list
const togglePatrons = (button) => {
  const patrons = document.querySelector(".patrons");
  if (patrons.dataset.open === "true") {
    patrons.dataset.open = false;
    button.querySelector("span").innerHTML = "See More";
  } else {
    patrons.dataset.open = true;
    button.querySelector("span").innerHTML = "See Less";
  }
};
