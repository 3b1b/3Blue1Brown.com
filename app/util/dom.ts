import type { ReactNode } from "react";
import { deepMap, onlyText } from "react-children-utilities";

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
