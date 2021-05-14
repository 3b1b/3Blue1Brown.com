// expand/collapse topic
const toggleTopic = (target) => {
  // save expanded state
  const expanded = target.dataset.expanded;

  // collapse all
  document
    .querySelectorAll(".topic_card")
    .forEach((card) => (card.dataset.expanded = false));

  // toggle expand of clicked topic card
  if (expanded === "true") {
    target.scrollIntoView({ block: "nearest" });
  } else {
    target.dataset.expanded = true;
    target.scrollIntoView();
  }
};
