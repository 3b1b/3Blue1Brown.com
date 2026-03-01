import { index, layout, route } from "@react-router/dev/routes";

export default [
  index("pages/home/Home.tsx"),
  layout("pages/Layout.tsx", [
    route("testbed", "pages/testbed/Testbed.mdx"),
    route("about", "pages/about/About.mdx"),
    route("extras", "pages/extras/Extras.tsx"),
    route("*", "pages/NotFound.tsx"),
  ]),
  route("lessons/:id", "pages/lessons/Lesson.tsx"),
  route("talent", "pages/talent/Talent.tsx"),
  route("talent/:id", "pages/talent/Partner.tsx"),
  route("blog/:id", "pages/blog/Post.tsx"),
  route("sitemap.xml", "sitemap.xml.ts"),
];
