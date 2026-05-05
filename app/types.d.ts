declare module "@fontsource-variable/*";

namespace React.JSX {
  // eslint-disable-next-line -- for declaration merging
  interface IntrinsicElements {
    // youtube-video-element
    "youtube-video": JSX.HTMLAttributes<HTMLVideoElement>;
    // react three fiber
    orbitControls: unknown;
    parametricGeometry: unknown;
  }
}
