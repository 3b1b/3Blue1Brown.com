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

// expand/collapse topics
const toggleTopics = (target) => {
  if (target.innerHTML.includes("Expand All")) {
    expandTopics();
    target.innerHTML = "Collapse All";
  } else {
    collapseTopics();
    target.innerHTML = "Expand All";
  }
};

// expand all topics
const expandTopics = () => {
  document
    .querySelectorAll(".topic_card")
    .forEach((topic) => (topic.dataset.expanded = true));
};

// collapse all topics
const collapseTopics = () => {
  document
    .querySelectorAll(".topic_card")
    .forEach((topic) => (topic.dataset.expanded = false));
};

// expand topic in url hash
const expandHashTopic = () => {
  const hash = window.location.hash;
  if (!hash) return;
  const topic = document.querySelector(hash);
  topic.dataset.expanded = "true";
  topic.scrollIntoView();
};

// always start collapsed if javascript enabled
window.addEventListener("DOMContentLoaded", collapseTopics);

// expand linked topic on finished load
window.addEventListener("load", expandHashTopic);
