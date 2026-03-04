import type { ReactNode } from "react";
import { deepMap, onlyText } from "react-children-utilities";
import confetti from "canvas-confetti";
import { frame, waitFor, waitForStable } from "~/util/misc";

// get text content of react node
export const renderText = (node: ReactNode) =>
  // map all children to text
  deepMap(node, (node) => ` ${onlyText(node)} `)
    .join("")
    // collapse spaces
    .replaceAll(/\s+/g, " ")
    .trim();
/*
  can't use renderToString because doesn't have access to contexts app needs
  (e.g. router), throwing many errors. impractical to work around (have to
  provide or fake all contexts).

  https://react.dev/reference/react-dom/server/renderToString#removing-rendertostring-from-the-client-code

  alternative react suggests (createRoot, flushSync, root.render) completely
  impractical. has same context issue, and also can't be called during
  render/lifecycle (could be worked around by making it async, but then using
  this function in situ becomes much more of pain).
*/

// get coordinates of element relative to document
export const getDocBbox = (element: Element) => {
  const { left, top, right, bottom } = element.getBoundingClientRect();
  return {
    top: top + window.scrollY,
    bottom: bottom + window.scrollY,
    left: left + window.scrollX,
    right: right + window.scrollX,
  };
};

// check if css selector is valid
const validSelector = (selector: unknown) => {
  if (typeof selector !== "string") return false;
  try {
    document.querySelector(selector);
    return true;
  } catch (e) {
    return false;
  }
};

// scroll to element, optionally by selector
export const scrollTo = async (
  element: Element | string | undefined | null,
  options: ScrollIntoViewOptions = { behavior: "smooth" },
  waitForLayoutShift = false,
) => {
  if (typeof element === "string") {
    const selector = element;
    if (!validSelector(selector)) return;
    // wait for element to appear
    element = await waitFor(() => document.querySelector(selector));
  }

  if (!element) return;

  // track if user scrolled
  let userScrolled = false;
  window.addEventListener("scroll", () => (userScrolled = true), {
    once: true,
  });

  // wait for layout shifts to stabilize
  if (waitForLayoutShift) await waitForStable(() => getDocBbox(element).top);

  // if user scrolled while waiting, abort
  if (userScrolled) return;

  // scroll to element
  element.scrollIntoView(options);
};

// scroll page so that mouse stays at same position in document
export const preserveScroll = async (element?: Element | null) => {
  if (!element) return;
  const oldY = element.getBoundingClientRect().top;
  await frame();
  const newY = element.getBoundingClientRect().top;
  window.scrollBy({ top: newY - oldY, behavior: "instant" });
};

// find index of first element "in view". model behavior off of wikiwand.com.
export const firstInView = (elements: Element[]) => {
  for (let index = elements.length - 1; index >= 0; index--) {
    const element = elements[index]!;
    const offset =
      parseFloat(window.getComputedStyle(element).scrollMarginTop) || 0;
    const { top } = element.getBoundingClientRect();
    if (top < offset) return index;
  }
  return 0;
};

// find next/previous node that matches condition, in dom order
export const findClosest = (
  element: HTMLElement,
  condition: string | ((element: HTMLElement) => boolean),
  direction: "next" | "previous" = "previous",
) => {
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
  );
  walker.currentNode = element;
  while (direction === "next" ? walker.nextNode() : walker.previousNode()) {
    const current = walker.currentNode as HTMLElement;
    if (typeof condition === "string" && current.matches(condition))
      return current;
    if (typeof condition === "function" && condition(current)) return current;
  }
};

// shake animation
export const shake = (element: Element | null | undefined) => {
  element?.animate(
    [
      { translate: "0 0" },
      { translate: "-5px 0" },
      { translate: "5px 0" },
      { translate: "-5px 0" },
      { translate: "5px 0" },
      { translate: "0 0" },
    ],
    { duration: 500, easing: "linear" },
  );
};

// confetti animation
export const celebrate = () => {
  confetti({
    scalar: 0.5,
    spread: 360,
    particleCount: 100,
    ticks: 100,
    origin: { x: 0.5, y: 0.5 },
    startVelocity: 10,
    gravity: 0,
    decay: 0.95,
    colors: ["#3187ca"],
    disableForReducedMotion: true,
  });
};
