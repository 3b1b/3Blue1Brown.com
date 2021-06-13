import { readFileSync, statSync, existsSync } from "fs";
import { basename, extname, dirname, join } from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { glob } from "glob";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import topics from "../data/topics.yaml";

// define some terms to avoid confusion:
// pages = top level /content pages like home, about, lessons, etc
// lessons = pages under /content/lessons
// source = local location where file is loaded from
// path = url where file gets published to in resulting site

// read mdx file, get derived props, and return info in desired structure
const parseMdx = (source) => {
  // read mdx
  const { data, content } = matter(readFileSync(source, "utf8"));

  // put dates in serializable format
  data.date = new Date(data.date || new Date()).toISOString();
  data.lastMod = new Date(statSync(source).mtime || new Date()).toISOString();

  // get patrons data
  let patrons = join(dirname(source), "patrons.txt");
  patrons = existsSync(patrons)
    ? readFileSync(patrons, "utf8").split("\n")
    : [];

  // set flag for whether lesson has text content
  data.empty = (content || "").trim() === "";

  // get id/slug from source path
  data.slug = getSlugFromSource(source);

  // get topic of lesson
  data.topic =
    topics.find(({ lessons }) => lessons.find((lesson) => lesson === data.slug))
      ?.name || "Uncategorized";

  // return desired info
  return { content, patrons, ...data };
};

// make serialized source for mdx renderer
const serializeMdx = async ({ content, ...rest }) => {
  const source = await serialize(content, {
    scope: rest,
    mdxOptions: {
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    },
  });
  return { content, source, ...rest };
};

// get slug from filename or parent directory
const getSlugFromSource = (source) => {
  const filename = basename(source, extname(source));
  const parentFolderName = basename(dirname(source));
  if (filename === "index") return parentFolderName;
  else return filename;
};

// search for local location of page file, return array of results
const searchPageSource = (slug) =>
  glob.sync(`public/content/${slug || "!(index)*"}.mdx`);

// local location of all page files
const pageSources = searchPageSource();

// url paths of page files
export const pagePaths = pageSources.map(
  (path) => "/" + basename(path, extname(path))
);

// search for local location of lesson file, return array of results
const searchLessonSource = (slug) => [
  ...glob.sync(`public/content/lessons/*/${slug || "*"}/index.mdx`),
  ...(process.env.mode !== "production"
    ? glob.sync(`public/content/lessons/${slug || "!(index)*"}.mdx`)
    : []),
];

// local location of all lesson files
const lessonSources = searchLessonSource();

// url paths for lessons
export const lessonPaths = lessonSources
  .map(getSlugFromSource)
  .map((path) => "/lessons/" + path);

// metadata for all lessons (just front matter)
const lessonMeta = lessonSources
  .map(parseMdx)
  .map(({ patrons, content, ...rest }) => rest)
  .sort((b, a) => new Date(a.date) - new Date(b.date));

// get desired props for pages
export const pageProps = async (slug) => {
  const source = searchPageSource(slug)[0];
  const props = await serializeMdx(parseMdx(source));
  props.lessons = lessonMeta;
  return { props };
};

// get desired props for lessons
export const lessonProps = async (slug) => {
  const source = searchLessonSource(slug)[0];
  const props = await serializeMdx(parseMdx(source));
  props.lessons = lessonMeta;
  return { props };
};
