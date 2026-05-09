declare module "@fontsource-variable/*";

namespace React.JSX {
  // eslint-disable-next-line -- for declaration merging
  interface IntrinsicElements {
    // youtube-video-element
    "youtube-video": JSX.HTMLAttributes<HTMLVideoElement>;
    // vimeo-video-element
    "vimeo-video": JSX.HTMLAttributes<HTMLIFrameElement>;
    // react three fiber
    orbitControls: unknown;
    parametricGeometry: unknown;
  }
}
