/*

Note: As of June 23, 2021, this component is not being used, so elements
with data-fade will not fade in as expected. To re-enable this behavior,
import the component and use it in NormalLayout.js.

If you are living far in the future and nobody is using this component,
consider deleting it. (I'm preserving it for now in case we want it
again in the near future.)

*/

import { useEffect } from "react";

// options
const duration = 250; // transition duration
const delay = 10; // delay before transition
const offset = 100; // extra delay for items further to right of screen

// singleton component to fade in any element with the data-fade attribute when
// it comes into view
const Fade = () => {
  useEffect(() => {
    const options = { childList: true, subtree: true };
    new MutationObserver(onMutation).observe(document.body, options);
  }, []);

  return null;
};

export default Fade;

// when there's any dom change
const onMutation = () => {
  // find data-fade elements and attach "in view" listeners to them
  const elements = document.querySelectorAll("[data-fade]");
  for (const element of elements) {
    new IntersectionObserver(fadeInView).observe(element);
    element.style.opacity = 0;
  }
};

// when element comes into view
let fadeInView = (entries) => {
  for (const { target, isIntersecting } of entries)
    if (isIntersecting) {
      const x = target.getBoundingClientRect().left / window.innerWidth;
      window.setTimeout(() => startFade(target), delay + 3 * offset * x);
    }
};

// start fade in
const startFade = (target) => {
  target.style.transition = `opacity ${duration}ms linear`;
  target.style.opacity = 1;
  window.setTimeout(() => endFade(target), duration);
};

// end fade in
const endFade = (target) => {
  target.style.transition = "";
  target.removeAttribute("data-fade");
};
