// get watch video from id
export const getWatch = (id: string) => `https://www.youtube.com/watch?v=${id}`;

// get thumbnail image from video id
export const getThumbnail = (id: string) =>
  `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;
