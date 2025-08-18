import { lessonMeta } from "../../../util/pages";

export default function handler(req, res) {
  const { slug } = req.query;
  
  if (!slug) {
    return res.status(400).json({ error: "Missing slug parameter" });
  }

  // Find the lesson with matching slug
  const lesson = lessonMeta.find(lesson => lesson.slug === slug);
  
  if (!lesson) {
    return res.status(404).json({ error: "Lesson not found" });
  }

  // Check if lesson has video
  if (!lesson.video || lesson.video.trim() === '') {
    return res.status(404).json({ error: "Lesson has no video" });
  }

  // Return meta tag data for social media
  const metaData = {
    title: lesson.title || '3Blue1Brown',
    description: lesson.description || 'Math videos with a visual approach',
    image: lesson.thumbnail,
    url: `https://www.3blue1brown.com/?v=${slug}`,
    type: 'video.other',
    video: {
      url: `https://www.youtube.com/watch?v=${lesson.video}`,
      type: 'text/html',
      width: 1280,
      height: 720
    },
    site_name: '3Blue1Brown',
    date: lesson.date
  };

  // Set headers to make this cacheable
  res.setHeader('Cache-Control', 'public, s-maxage=86400, stale-while-revalidate=604800');
  
  return res.status(200).json(metaData);
}