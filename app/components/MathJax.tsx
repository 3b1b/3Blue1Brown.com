import { useEffect } from "react";
import { useMutationObserver } from "@reactuses/core";
import "./MathJax.css";

// mathjax unfortunately designed to best be loaded from cdn
// trying to install as package and import causes many issues
const cdn = "https://cdn.jsdelivr.net/npm/mathjax@4/tex-svg.js";

// enable mathjax on page
export default function MathJax() {
  // parse math on load
  useEffect(() => {
    init().then(render);
  }, []);

  // parse math on dom changes
  useMutationObserver(
    (entries) => {
      // only run if a math element is added
      for (const { addedNodes } of entries)
        for (const node of addedNodes)
          if (
            node instanceof HTMLElement &&
            node.querySelector("code.language-math")
          )
            return render();
    },
    () => document.body,
    {
      subtree: true,
      childList: true,
    },
  );

  return null;
}

declare global {
  // eslint-disable-next-line
  interface Window {
    // eslint-disable-next-line
    MathJax: any;
  }
}

// initialize mathjax
const init = async () => {
  // ensure only one load
  if (window.MathJax) return;

  // configure
  window.MathJax = {
    svg: {
      fontCache: "local",
    },
    loader: {
      load: ["[tex]/color"],
    },
    tex: {
      packages: {
        "[+]": ["color"],
        // force undefined macros to throw and render merror dom element
        "[-]": ["noundefined"],
      },
      macros: {
        degree: "{^\\circ}",
      },
      // force parsing errors to throw and render merror dom element
      formatError: (jax: unknown, error: Error) => {
        error.name = "MathJaxError";
        throw error;
      },
    },
    startup: {
      typeset: false,
    },
  };

  // load from node_modules
  const script = document.createElement("script");
  script.src = cdn;
  script.type = "text/javascript";
  script.async = true;
  document.head.appendChild(script);
  await new Promise((resolve, reject) => {
    script.onload = resolve;
    script.onerror = reject;
  });
  // wait for mathjax to start up
  await window.MathJax.startup?.promise;
};

const render = async () => {
  // get output from remark-math, which processes $ math blocks into <code> elements
  const elements = document.querySelectorAll("code.language-math");
  for (let element of elements) {
    // math tex content
    const math = element.textContent ?? "";
    // parent container
    const parent = element.parentElement;
    if (!parent) continue;
    // block vs inline math
    const display = parent.matches("pre");
    // convert to svg content
    let content: Element | undefined = undefined;
    try {
      // try synchronous for responsiveness
      content = window.MathJax.tex2svg?.(math, { display });
    } catch (error) {
      // fallback to async if things still loading
      content = await window.MathJax.tex2svgPromise?.(math, { display });
    }
    if (!content) continue;
    // insert content
    if (display) element = parent;
    element.replaceWith(content);
  }
};
