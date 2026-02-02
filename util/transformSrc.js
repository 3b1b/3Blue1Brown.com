import { bucket } from "../data/site.yaml";

function ensureLeadingSlash(str) {
    if (str && !str.startsWith("/")) return "/" + str;
    return str;
}

// change provided srcs (png & mp4) to external bucket location for production.
export const transformSrc = (src, dir = "") => {
  if (src.endsWith(".mp4")) {
    // Hack to make preview images show on Safari
    src = src + "#t=0.001";
  }
  // Don't modify absolute URLs
  if (src.startsWith("http")) {
    return src;
  }

  // For absolute paths (starting with /), don't prepend dir
  // For relative paths, prepend dir
  const fullPath = src.startsWith("/") ? src : dir + src;

  if (
    process.env.NODE_ENV === "production" &&
    process.env.NEXT_PUBLIC_NETLIFY_CONTEXT === "production" && // Not a deploy preview
    !src.endsWith("svg")
  ) {
    return bucket + ensureLeadingSlash(fullPath);
  } else {
    return fullPath;
  }
};