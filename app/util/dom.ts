import { frame, waitFor, waitForStable } from "~/util/async";

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
  } catch {
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

  // wait for layout shifts to stabilize
  if (waitForLayoutShift)
    await waitForStable(
      () => getDocBbox(element).top,
      // wait proportionally to doc size
      document.body.scrollHeight / 30,
    );

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
  element: Element,
  condition: string | ((element: Element) => boolean),
  direction: "next" | "previous" = "previous",
) => {
  // normalize condition to function
  if (typeof condition === "string") {
    const selector = condition;
    condition = (element: Element) => element.matches(selector);
  }
  // create walker
  const walker = document.createTreeWalker(
    document.body,
    NodeFilter.SHOW_ELEMENT,
  );
  // start at element
  walker.currentNode = element;
  // current node walker pointing to (don't use walker.currentNode b/c doesn't change to null when next/prevNode returns null)
  let current: Node | null;
  while (
    // walk to next/previous node in dom order
    (current = direction === "next" ? walker.nextNode() : walker.previousNode())
  ) {
    // if no more nodes, stop
    if (current === null) break;
    // if text/comment/etc. node, skip
    if (!(current instanceof Element)) continue;
    // if node matches condition, return it
    if (condition(current)) return current;
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

// debug log (but don't stop) google translate react interaction errors
// https://github.com/facebook/react/issues/11538#issuecomment-417504600
// https://martijnhols.nl/blog/everything-about-google-translate-crashing-react
// https://github.com/vercel/next.js/issues/58055
if (typeof Node === "function" && Node.prototype) {
  const oldRemove = Node.prototype.removeChild;
  // @ts-expect-error hack
  Node.prototype.removeChild = function (child: Node) {
    if (child.parentNode !== this)
      console.error("Removed child from wrong parent", this, child);
    return oldRemove.call(this, child);
  };
  const oldInsert = Node.prototype.insertBefore;
  // @ts-expect-error hack
  Node.prototype.insertBefore = function (_new: Node, reference: Node) {
    if (reference && reference.parentNode !== this)
      console.error("Inserted before wrong parent", this, _new, reference);
    return oldInsert.call(this, _new, reference);
  };
}
