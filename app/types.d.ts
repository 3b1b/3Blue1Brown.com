declare module "@fontsource-variable/*";

// https://www.npmjs.com/package/youtube-video-element
namespace React.JSX {
  // eslint-disable-next-line
  interface IntrinsicElements {
    "youtube-video": JSX.HTMLAttributes<HTMLVideoElement>;
  }
}

/** https://github.com/JonasKruckenberg/imagetools/issues/160 */
declare module "*url&format=webp" {
  const value: string;
  export default value;
}
