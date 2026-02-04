// pause animation on element and sub-elements, and optionally set to specific time
export const pauseAnimations = (element: Element, time?: number) => {
  element.getAnimations({ subtree: true }).forEach((animation) => {
    animation.pause();
    if (time !== undefined) animation.currentTime = time;
  });
};
