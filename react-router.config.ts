import { writeFileSync } from "fs";
import type { Config } from "@react-router/dev/config";

export default {
  // no server
  ssr: false,

  // prerender all routes
  prerender: async ({ getStaticPaths }) => {
    // get all blog post routes to prerender
    const posts = Object.keys(
      import.meta.glob("./app/pages/blog/**/*.mdx", { eager: true }),
    ).map(
      (path) =>
        // get route name from path
        path.match(new RegExp("./app/pages(/blog/.*)/index.mdx"))?.[1] ?? "",
    );

    const routes = [
      // regular, non-glob routes
      ...getStaticPaths(),
      // dynamic routes
      ...posts,
    ];

    // export pre-rendered routes for testing purposes
    writeFileSync("./tests/routes.json", JSON.stringify(routes, null, 2));

    return routes;
  },
} satisfies Config;
