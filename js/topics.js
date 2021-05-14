// expand/collapse topic
const toggleTopic = (target) => {
  if (target.dataset.expanded === "true") {
    target.dataset.expanded = false;
    target.scrollIntoView({ block: "nearest" });
  } else {
    target.dataset.expanded = true;
    target.scrollIntoView();
  }
};
