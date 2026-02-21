import type { ReactNode } from "react";
import { deepMap, onlyText } from "react-children-utilities";
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

  // wait for layout shifts to stabilize
  if (waitForLayoutShift) await waitForStable(() => getDocBbox(element).top);

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
