declare module "@fontsource-variable/*";

// https://www.npmjs.com/package/youtube-video-element
namespace React.JSX {
  // eslint-disable-next-line
  interface IntrinsicElements {
    "youtube-video": JSX.HTMLAttributes<HTMLVideoElement>;
  }
}
