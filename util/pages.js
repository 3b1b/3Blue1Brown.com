import { readFileSync, statSync, existsSync } from "fs";
import { basename, extname, dirname, join, relative } from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { glob } from "glob";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import sizeOfImage from "image-size";
import topics from "../data/topics.yaml";
import * as site from "../data/site.yaml";

// define some terms to avoid confusion:
// pages = top level /content pages like home, about, lessons, etc
// lessons = pages under /content/lessons
// file = local location where file is loaded from
// path = url where file gets published to in resulting site

// read mdx file, get derived props, and return info in desired structure
const parseMdx = (file) => {
  // read mdx
  let { data, content } = matter(readFileSync(file, "utf8"));

  // There seems to be some sort of caching where the data object
  // is the exact same each time. But we want a fresh copy each time
  // so that we can modify it without affecting the result if `matter`
  // runs on the same file again.
  data = { ...data };

  // put dates in serializable format
  data.date = data.date ? new Date(data.date).toISOString() : null;
  data.lastMod = new Date(statSync(file).mtime || new Date()).toISOString();

  // rename github repo "source" prop to avoid conflict with mdx serialized "source"
  data.sourceCode = data.source || "";

  // get patrons data
  let patrons = join(dirname(file), "patrons.txt");
  patrons = existsSync(patrons)
    ? readFileSync(patrons, "utf8").split("\n")
    : [];

  // set flag for whether lesson has text content
  data.empty = (content || "").trim() === "";

  // info about original loaded file
  data.slug = getSlugFromFile(file);
  data.file = "/" + file.split(/[\\/]/).slice(1).join("/");
  data.dir = "/" + file.split(/[\\/]/).slice(1, -1).join("/") + "/";

  // get topic of lesson (first match for consistency)
  data.topic =
    topics.find(({ lessons }) => lessons && lessons.find((lesson) => lesson === data.slug))
      ?.name || "Uncategorized";

  if (data.thumbnail) {
    // Get absolute path to thumbnail
    data.thumbnail =
      "/" + relative("public", join(dirname(file), data.thumbnail));
  } else {
    if (data.video) {
      // Use youtube thumbnail by default...
      data.thumbnail = `https://img.youtube.com/vi/${data.video}/maxresdefault.jpg`;
    } else {
      // ...or a truly generic default thumbnail
      data.thumbnail = "/favicons/share-thumbnail.jpg";
    }
  }

  // return desired info
  return { content, patrons, ...data };
};

// make serialized file for mdx renderer
const serializeMdx = async ({ content, ...rest }, additionalScope = {}) => {
  const source = await serialize(content, {
    scope: { site, ...additionalScope },
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex, rehypeSlug],
    },
  });
  return { ...rest, content, source };
};

// get slug from filename or parent directory
const getSlugFromFile = (file) => {
  const filename = basename(file, extname(file));
  const parentFolderName = basename(dirname(file));
  if (filename === "index") return parentFolderName;
  else return filename;
};

const getMediaDimensionsFromDir = async (directory) => {
  // get dimensions of image & video files
  const mediaFiles = glob.sync(
    `${directory}/**/*.@(jpg|jpeg|png|svg|mp4|mov|)`
  );

  function getDimensions(fileName) {
    const fileExtension = fileName.split(".").reverse()[0];
    const type = {
      jpg: "image",
      jpeg: "image",
      png: "image",
      svg: "image",
      mp4: "video",
      mov: "video",
    }[fileExtension];

    return new Promise((resolve) => {
      // In the future, it would also be valuable to get the dimensions of
      // videos, but that seems a bit tricky to get working, so for now
      // it's images only. (Video dimensions will be determined on the
      // client side whenever the video actually loads.)
      if (type === "image") {
        sizeOfImage(fileName, (err, dims) => {
          resolve(dims || null);
        });
      } else {
        resolve(null);
      }
    });
  }

  let dimensionsMap = {};

  await Promise.all(
    mediaFiles.map((fileName) =>
      getDimensions(fileName).then((dims) => {
        if (dims) {
          dimensionsMap[fileName.slice(6)] = dims;
        }
      })
    )
  );

  return dimensionsMap;
};

// search for local location of page file, return array of results
const searchPageFile = (slug) =>
  glob.sync(`public/content/${slug || "!(index)*"}.mdx`);

// local location of all page files
const pageFiles = searchPageFile();

// url paths of page files
export const pagePaths = pageFiles.map(
  (path) => "/" + basename(path, extname(path))
);

// search for local location of lesson file(s), return array of results
const searchLessonFile = (slug) => [
  ...glob.sync(`public/content/lessons/*/${slug || "*"}/index.mdx`),
  ...(process.env.NODE_ENV !== "production"
    ? glob.sync(`public/content/lessons/${slug || "!(index)*"}.mdx`)
    : []),
];

// local location of all lesson files
const lessonFiles = searchLessonFile();

// url paths for lessons
export const lessonPaths = lessonFiles
  .map(getSlugFromFile)
  .map((path) => "/lessons/" + path);

// metadata for all lessons (just front matter)
export const lessonMeta = lessonFiles
  .map(parseMdx)
  .map(({ patrons, content, ...rest }) => rest)
  .sort((b, a) => new Date(a.date) - new Date(b.date));

// lightweight lesson metadata for homepage (only essential fields)
export const lessonMetaLight = lessonMeta.map(lesson => ({
  slug: lesson.slug,
  title: lesson.title,
  // Truncate descriptions to reduce payload (homepage only shows first ~100 chars anyway)
  description: lesson.description ? 
    (lesson.description.length > 200 ? lesson.description.substring(0, 200) + '...' : lesson.description) 
    : null,
  date: lesson.date,
  video: lesson.video || null,
  // Use standardized YouTube thumbnail URL to save space vs custom paths
  thumbnail: lesson.video ? 
    `https://img.youtube.com/vi/${lesson.video}/maxresdefault.jpg` : 
    lesson.thumbnail,
  topic: lesson.topic,
  empty: lesson.empty,
}));

const searchBlogFile = (slug) =>
  glob.sync(`public/content/blog/${slug || "*"}/index.mdx`);

const blogFiles = searchBlogFile();

export const blogPaths = blogFiles
  .map(getSlugFromFile)
  .map((slug) => `/blog/${slug}`);

export const blogMeta = blogFiles
  .map(parseMdx)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

const searchTalentFile = (slug) =>
  glob.sync(`public/content/talent/${slug || "*"}/index.mdx`);

const talentFiles = searchTalentFile();

export const talentPaths = talentFiles
  .map(getSlugFromFile)
  .map((slug) => `/talent/${slug}`);

export const talentMeta = talentFiles
  .map(parseMdx)
  .map(({ patrons, content, ...rest }) => rest);

// get desired props for pages
export const pageProps = async (slug) => {
  const file = searchPageFile(slug)[0];
  
  // Special optimization for homepage - skip heavy MDX serialization
  if (slug === 'index') {
    const parsedMdx = parseMdx(file);
    return {
      props: {
        // Only include essential fields for homepage
        title: parsedMdx.title || site.title,
        description: parsedMdx.description || site.description,
        lessons: lessonMetaLight,
        blogPosts: [],
        site: site,
        // Skip source (serialized MDX) to save ~100kB
        content: parsedMdx.content,
        // Add minimal metadata needed by layout
        slug: parsedMdx.slug,
        file: parsedMdx.file,
        dir: parsedMdx.dir,
        date: parsedMdx.date,
      }
    };
  }
  
  const additionalScope = slug === 'talent/index' ? { talentMeta } : {};
  const props = await serializeMdx(parseMdx(file), additionalScope);
  props.lessons = lessonMeta;
  props.blogPosts = blogMeta;
  props.site = site;
  if (slug === 'talent/index') {
    props.talentMeta = talentMeta;
  }
  return { props };
};

// get desired props for lessons
export const lessonProps = async (slug) => {
  const file = searchLessonFile(slug)[0];
  const props = await serializeMdx(parseMdx(file));
  props.mediaDimensions = await getMediaDimensionsFromDir(dirname(file));
  props.lessons = lessonMeta;
  props.blogPosts = blogMeta;
  props.site = site;
  return { props };
};

// get desired props for blog
export const blogProps = async (slug) => {
  const file = searchBlogFile(slug)[0];
  const props = await serializeMdx(parseMdx(file));
  props.mediaDimensions = await getMediaDimensionsFromDir(dirname(file));
  props.lessons = lessonMeta;
  props.blogPosts = blogMeta;
  props.site = site;
  return { props };
};

// get desired props for talent
export const talentProps = async (slug) => {
  const file = searchTalentFile(slug)[0];
  const props = await serializeMdx(parseMdx(file));
  props.mediaDimensions = await getMediaDimensionsFromDir(dirname(file));
  return { props };
};
