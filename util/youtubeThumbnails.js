/**
 * Utility functions for generating YouTube thumbnail URLs at different resolutions
 * 
 * YouTube thumbnail sizes:
 * - maxresdefault.jpg: 1920x1080 (highest quality, but may not exist for all videos)
 * - hqdefault.jpg: 480x360 (high quality, always available)
 * - mqdefault.jpg: 320x180 (medium quality)
 * - sddefault.jpg: 640x480 (standard definition)
 * - default.jpg: 120x90 (lowest quality)
 */

export const YOUTUBE_THUMBNAIL_SIZES = {
  max: 'maxresdefault',     // 1920x1080 - for large displays
  high: 'hqdefault',        // 480x360 - for medium displays
  medium: 'mqdefault',      // 320x180 - for small displays/mobile
  standard: 'sddefault',    // 640x480 - alternative medium size
  default: 'default'        // 120x90 - very small/fallback
};

/**
 * Generate a YouTube thumbnail URL for a given video ID and size
 * @param {string} videoId - YouTube video ID
 * @param {string} size - Size key from YOUTUBE_THUMBNAIL_SIZES
 * @returns {string} Full thumbnail URL
 */
export const getYouTubeThumbnail = (videoId, size = 'max') => {
  const thumbnailSize = YOUTUBE_THUMBNAIL_SIZES[size] || YOUTUBE_THUMBNAIL_SIZES.max;
  return `https://img.youtube.com/vi/${videoId}/${thumbnailSize}.jpg`;
};

/**
 * Generate responsive YouTube thumbnail sources for different screen sizes
 * @param {string} videoId - YouTube video ID
 * @returns {object} Object with thumbnail URLs for different breakpoints
 */
export const getResponsiveYouTubeThumbnails = (videoId) => {
  return {
    // For very small screens (mobile in portrait)
    mobile: getYouTubeThumbnail(videoId, 'medium'),    // 320x180
    // For medium screens (tablet, mobile landscape)
    tablet: getYouTubeThumbnail(videoId, 'high'),      // 480x360
    // For large screens (desktop)
    desktop: getYouTubeThumbnail(videoId, 'max'),      // 1920x1080
    // Fallback for all sizes
    default: getYouTubeThumbnail(videoId, 'high')      // 480x360
  };
};

/**
 * Get the appropriate thumbnail size based on a breakpoint or context
 * @param {string} context - Context like 'mobile', 'tablet', 'desktop', 'card', etc.
 * @returns {string} Size key for YOUTUBE_THUMBNAIL_SIZES
 */
export const getThumbnailSizeForContext = (context) => {
  switch (context) {
    case 'mobile':
    case 'small':
    case 'card-mobile':
      return 'medium';  // 320x180
    case 'tablet':
    case 'medium':
    case 'card-tablet':
      return 'high';    // 480x360
    case 'desktop':
    case 'large':
    case 'featured':
      return 'max';     // 1920x1080
    default:
      return 'high';    // 480x360 as reasonable default
  }
};