// glow element background color temporarily
export const glowElement = (element) => {
  element.removeAttribute("data-glow");
  window.requestAnimationFrame(() => (element.dataset.glow = true));
  window.setTimeout(() => (element.dataset.glow = false), 2000);
};

// shake element temporarily
export const shakeElement = (element) => {
  element.removeAttribute("data-shake");
  window.requestAnimationFrame(() => (element.dataset.shake = true));
  window.setTimeout(() => (element.dataset.shake = false), 250);
};
