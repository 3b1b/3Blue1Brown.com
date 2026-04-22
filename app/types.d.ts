declare module "@fontsource-variable/*";

namespace React.JSX {
  // eslint-disable-next-line
  interface IntrinsicElements {
    // https://www.npmjs.com/package/youtube-video-element
    "youtube-video": JSX.HTMLAttributes<HTMLVideoElement>;
    // react three fiber
    orbitControls: unknown;
    parametricGeometry: unknown;
  }
}

// https://github.com/JonasKruckenberg/imagetools/issues/160
declare module "*&imagetools" {
  /**
   * actual types
   * - code https://github.com/JonasKruckenberg/imagetools/blob/main/packages/core/src/output-formats.ts
   * - docs https://github.com/JonasKruckenberg/imagetools/blob/main/docs/guide/getting-started.md#metadata
   */
  const out;
  export default out;
}
