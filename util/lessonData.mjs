// Lightweight module for lesson metadata - no MDX dependencies
import { readFileSync, statSync } from "fs";
import { basename, extname, dirname, join } from "path";
import matter from "gray-matter";
import globPkg from "glob";
import yaml from "js-yaml";

const { glob } = globPkg;

// Load topics from YAML file
const topicsFile = readFileSync("data/topics.yaml", "utf8");
const topics = yaml.load(topicsFile);

// Get slug from filename or parent directory
const getSlugFromFile = (file) => {
  const filename = basename(file, extname(file));
  const parentFolderName = basename(dirname(file));
  if (filename === "index") return parentFolderName;
  else return filename;
};

// Parse MDX file for metadata only (no serialization)
const parseMdxMetadata = (file) => {
  const { data, content } = matter(readFileSync(file, "utf8"));

  // Clone data to avoid caching issues
  const metadata = { ...data };

  // Put dates in serializable format
  metadata.date = metadata.date ? new Date(metadata.date).toISOString() : null;

  // Set flag for whether lesson has text content
  metadata.empty = (content || "").trim() === "";

  // Get slug
  metadata.slug = getSlugFromFile(file);

  // Get topic of lesson
  metadata.topic =
    topics.find(({ lessons }) => lessons && lessons.find((lesson) => lesson === metadata.slug))
      ?.name || "Uncategorized";

  // Set thumbnail
  if (!metadata.thumbnail) {
    if (metadata.video) {
      metadata.thumbnail = `https://img.youtube.com/vi/${metadata.video}/maxresdefault.jpg`;
    } else {
      metadata.thumbnail = "/favicons/share-thumbnail.jpg";
    }
  }

  return metadata;
};

// Search for lesson files
const searchLessonFile = (slug) => [
  ...glob.sync(`public/content/lessons/*/${slug || "*"}/index.mdx`),
  ...(process.env.NODE_ENV !== "production"
    ? glob.sync(`public/content/lessons/${slug || "!(index)*"}.mdx`)
    : []),
];

// Get all lesson files
const lessonFiles = searchLessonFile();

// Compute lightweight lesson metadata
export const lessonMetaLight = lessonFiles
  .map(parseMdxMetadata)
  .map(lesson => ({
    slug: lesson.slug,
    title: lesson.title,
    // Truncate descriptions to reduce payload
    description: lesson.description ?
      (lesson.description.length > 200 ? lesson.description.substring(0, 200) + '...' : lesson.description)
      : null,
    date: lesson.date,
    video: lesson.video || null,
    thumbnail: lesson.thumbnail,
    topic: lesson.topic,
    empty: lesson.empty,
  }))
  .sort((b, a) => new Date(a.date) - new Date(b.date));
