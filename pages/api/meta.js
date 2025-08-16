import { lessonMeta } from '../../util/pages';

export default function handler(req, res) {
  const { v: videoSlug } = req.query;
  
  if (!videoSlug) {
    return res.status(400).json({ error: 'Video slug is required' });
  }
  
  // Find the lesson with the matching slug
  const lesson = lessonMeta.find(lesson => lesson.slug === videoSlug);
  
  if (!lesson) {
    return res.status(404).json({ error: 'Video not found' });
  }
  
  // Generate meta tag HTML for the video
  const title = lesson.title ? `${lesson.title} - 3Blue1Brown` : '3Blue1Brown';
  const description = lesson.description || 'Mathematical animations and explanations';
  const thumbnail = lesson.thumbnail || '/favicons/share-thumbnail.jpg';
  const videoUrl = `${req.headers.host}/?v=${lesson.slug}`;
  
  const metaTags = `
    <title>${title}</title>
    <meta name="title" content="${title}" />
    <meta name="description" content="${description}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="https://${videoUrl}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:image" content="${thumbnail}" />
    <meta property="twitter:card" content="summary_large_image" />
    <meta property="twitter:url" content="https://${videoUrl}" />
    <meta property="twitter:title" content="${title}" />
    <meta property="twitter:description" content="${description}" />
    <meta property="twitter:image" content="${thumbnail}" />
  `;
  
  res.status(200).json({
    title,
    description,
    thumbnail,
    videoUrl,
    metaTags: metaTags.trim()
  });
}