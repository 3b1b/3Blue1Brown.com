import { readFileSync, statSync, existsSync } from "fs";
import { basename, extname, dirname, join } from "path";
import matter from "gray-matter";
import { serialize } from "next-mdx-remote/serialize";
import { glob } from "glob";

// pages = top level /content pages like home, about, lessons, etc
// lessons = pages under /content/lessons

// read mdx file and return info in desired structure
const readMdx = async (mdx, path) => {
  // read mdx
  const { data, content } = matter(mdx);

  // put dates in serializable format
  data.date = new Date(data.date || new Date()).toISOString();
  data.lastMod = new Date(statSync(path).mtime || new Date()).toISOString();

  // get patrons data
  let patrons = join(dirname(path), "patrons.txt");
  patrons = existsSync(patrons)
    ? readFileSync(patrons, "utf8").split("\n")
    : [];

  // make serialized source for mdx renderer
  const source = await serialize(content, { scope: data });

  // return desired info
  return { ...data, patrons, content, source };
};

// generate desired url paths for pages
export const pagePaths = async () =>
  glob
    .sync("content/!(index)*.mdx")
    .map((path) => "/" + basename(path, extname(path)));

// get desired props for pages
export const pageProps = async (slug) => {
  const path = `content/${slug}.mdx`;
  const mdx = readFileSync(path, "utf8");
  return { props: await readMdx(mdx, path) };
};

// generate desired url paths for lessons
export const lessonPaths = async () =>
  [
    ...glob.sync("content/lessons/!(index)*.mdx"),
    ...glob.sync("content/lessons/*/*/index.mdx"),
  ]
    .map((path) => {
      const filename = basename(path, extname(path));
      const parentFolderName = basename(dirname(path));
      if (filename === "index") return parentFolderName;
      else return filename;
    })
    .map((path) => "/lessons/" + path);

// get desired props for lessons
export const lessonProps = async (slug) => {
  const path = [
    ...glob.sync(`content/lessons/${slug}.mdx`),
    ...glob.sync(`content/lessons/*/${slug}/index.mdx`),
  ][0];
  const mdx = readFileSync(path, "utf8");
  return { props: await readMdx(mdx, path) };
};
