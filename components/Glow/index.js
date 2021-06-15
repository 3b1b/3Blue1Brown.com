import { useEffect } from "react";

// singleton component to glow elements on hash change
const Glow = () => {
  const onHashChange = () =>
    glowElement(document.getElementById(window.location.hash.slice(1)));

  useEffect(() => {
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  });
  return <></>;
};

export default Glow;

// glow element background color temporarily
export const glowElement = (element) => {
  element.removeAttribute("data-glow");
  window.requestAnimationFrame(() => (element.dataset.glow = true));
  window.setTimeout(() => (element.dataset.glow = false), 2000);
};
