import { useEffect } from "react";
import { useMutationObserver } from "@reactuses/core";

// enable mathjax on page
export default function MathJax() {
  // parse math on load
  useEffect(() => {
    init().then(render);
  }, []);

  // parse math on dom changes
  useMutationObserver(
    (entries) => {
      // only run if a <code class="language-math"> element is added
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

// mathjax has no type defs, so have to define our own
declare global {
  // eslint-disable-next-line
  interface Window {
    MathJax: {
      svg?: {
        fontCache?: string;
      };
      startup?: {
        typeset?: boolean;
        promise?: Promise<void>;
      };
      tex2svg?: (math: string, options: { display: boolean }) => Element;
      tex2svgPromise?: (
        math: string,
        options: { display: boolean },
      ) => Promise<Element>;
    };
  }
}

// initialize mathjax
const init = async () => {
  // configure
  window.MathJax = {
    svg: {
      fontCache: "local",
    },
    startup: {
      typeset: false,
    },
  };

  // load from node_modules
  const script = document.createElement("script");
  script.src = (await import("mathjax-full/es5/tex-svg.js?url")).default;
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
      // fallback to async if things still loading.
      content = await window.MathJax.tex2svgPromise?.(math, { display });
    }
    if (!content) continue;
    // make mjx-assistive-mml sr-only
    content
      .querySelectorAll("mjx-assistive-mml")
      .forEach((element) => element.classList.add("sr-only"));
    // insert content
    if (display) element = parent;
    element.replaceWith(content);
    // add sr-only text before
    const srText = document.createElement("span");
    srText.classList.add("sr-only");
    srText.textContent = content.getAttribute("aria-label") ?? math;
    content.before(srText);
  }
};
