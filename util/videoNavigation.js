/**
 * URL and navigation constants for video functionality
 */

export const VIDEO_URLS = {
  HOME_WITH_VIDEO: (slug) => `/?v=${slug}`,
  HOME: '/',
  LESSON: (slug) => `/lessons/${slug}`,
  LESSON_WITH_TITLE: (slug) => `/lessons/${slug}#title`,
};

export const VIDEO_QUERY_PARAM = 'v';

/**
 * Helper function to create video navigation URLs
 */
export const createVideoUrl = (slug) => {
  if (!slug) {
    console.warn('createVideoUrl called without slug');
    return VIDEO_URLS.HOME;
  }
  return VIDEO_URLS.HOME_WITH_VIDEO(slug);
};

/**
 * Helper function to extract video slug from router query
 */
export const getVideoSlugFromQuery = (query) => {
  return query?.[VIDEO_QUERY_PARAM] || null;
};