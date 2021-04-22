// tooltips plugin
// shows a popup of text on hover/focus of an element

// specify text to show in data-tooltip attribute
// specify placement (top, bottom, left, right) in data-placement attribute
// specify custom delay (in ms) in data-delay attribute

const defaultPlacement = "top";
const defaultDelay = 200;

// create tooltip listener on any element with a data-tooltip attribute
const createTooltips = () => {
  // get tooltip element
  const tooltip = document.querySelector(".tooltip");

  // init popper.js library
  let popper = null;
  let options = ({ placement = defaultPlacement }) => ({
    placement,
    modifiers: [
      // https://github.com/popperjs/popper-core/issues/1138
      { name: "computeStyles", options: { adaptive: false } },
      { name: "offset", options: { offset: [0, 10] } },
      { name: "arrow", options: { padding: 10 } },
    ],
  });

  // open tooltip after delay
  let timer;
  const delayedOpen = ({ target }) => {
    const delay = target.dataset.delay || defaultDelay;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => open({ target }), delay);
  };

  // open tooltip on specified target
  const open = ({ target }) => {
    if (popper) popper.destroy();
    popper = Popper.createPopper(target, tooltip, options(target.dataset));
    tooltip.dataset.show = true;
    tooltip.querySelector(".tooltip_content").innerHTML =
      target.dataset.tooltip;
  };

  // close tooltip
  const close = () => {
    window.clearTimeout(timer);
    tooltip.dataset.show = false;
  };

  // loop through elements with data-tooltip attribute
  const targets = document.querySelectorAll("[data-tooltip]");
  for (const target of targets) {
    // if data-tooltip attribute is not empty
    if ((target.dataset.tooltip || "").trim()) {
      // add triggers to target
      target.addEventListener("mouseenter", delayedOpen);
      target.addEventListener("focus", delayedOpen);
      target.addEventListener("mouseleave", close);
      target.addEventListener("blur", close);
      // add aria label for extra accessibility
      target.setAttribute("aria-label", target.dataset.tooltip);
    }
  }
};

// start script
window.addEventListener("load", createTooltips);
