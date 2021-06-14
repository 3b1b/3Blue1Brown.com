// shake element temporarily
export const shakeElement = (element) => {
  element.removeAttribute("data-shake");
  window.requestAnimationFrame(() => (element.dataset.shake = true));
  window.setTimeout(() => (element.dataset.shake = false), 250);
};
