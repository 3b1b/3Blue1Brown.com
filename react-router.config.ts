import { writeFileSync } from "fs";
import type { Config } from "@react-router/dev/config";

// helper to extract part of string using regex
const capture = (string: string, pattern: string) =>
  string.match(new RegExp(pattern))?.[1] ?? "";

export default {
  // no server
  ssr: false,

  // prerender all routes
  prerender: async ({ getStaticPaths }) => {
    // get all lesson routes to prerender
    const lessons = Object.keys(
      import.meta.glob("./app/pages/lessons/20\\d\\d/**/index.mdx", {
        eager: true,
      }),
    ).map(
      (path) =>
        // get route name from path
        "/lessons/" + capture(path, "lessons/20\\d\\d/(.*)/index.mdx"),
    );

    // get all partner routes to prerender
    const partners = Object.keys(
      import.meta.glob("./app/pages/talent/**/index.mdx", { eager: true }),
    ).map(
      (path) =>
        // get route name from path
        "/talent/" + capture(path, "talent/(.*)/index.mdx"),
    );

    // get all blog post routes to prerender
    const posts = Object.keys(
      import.meta.glob("./app/pages/blog/**/index.mdx", { eager: true }),
    ).map(
      (path) =>
        // get route name from path
        "/blog/" + capture(path, "blog/(.*)/index.mdx"),
    );

    const routes = [
      // regular, non-glob routes
      ...getStaticPaths(),
      // dynamic routes
      ...lessons,
      ...partners,
      ...posts,
    ];

    // export pre-rendered routes for testing purposes
    writeFileSync("./tests/routes.json", JSON.stringify(routes, null, 2));

    return routes;
  },
} satisfies Config;
