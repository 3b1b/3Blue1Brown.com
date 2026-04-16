import { index, route } from "@react-router/dev/routes";

// route manifest
export default [
  index("pages/home/Home.tsx"),
  route("lessons/:id", "pages/lessons/Lesson.tsx"),
  route("about", "pages/about/About.mdx"),
  route("extras", "pages/extras/Extras.tsx"),
  route("talent", "pages/talent/Talent.tsx"),
  route("talent/:id", "pages/talent/Partner.tsx"),
  route("blog/:id", "pages/blog/Post.tsx"),
  route("testbed", "pages/testbed/Testbed.mdx"),
  route("sitemap.xml", "sitemap.xml.ts"),
  route("*", "pages/NotFound.tsx"),
];
