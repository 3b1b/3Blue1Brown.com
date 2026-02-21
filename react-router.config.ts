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

    console.log(posts);

    return [
      // regular, non-glob routes
      ...getStaticPaths(),
      // dynamic routes
      ...posts,
    ];
  },
} satisfies Config;
