// expand/collapse topic
const toggleTopic = (target) => {
  // save open state
  const open = target.dataset.open;

  // collapse all
  document
    .querySelectorAll(".topic_card")
    .forEach((card) => (card.dataset.open = false));

  // toggle expand of clicked topic card
  if (open === "true") {
    target.scrollIntoView({ block: "nearest" });
  } else {
    target.dataset.open = true;
    target.scrollIntoView();
  }
};
