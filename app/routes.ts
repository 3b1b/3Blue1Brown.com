import type { RouteObject } from "react-router";
import type { loader } from "~/root";
import { matchRoutes, useRouteLoaderData } from "react-router";
import { index, layout, route } from "@react-router/dev/routes";

export default [
  index("pages/home/Home.tsx"),
  layout("pages/Layout.tsx", [
    route("testbed", "pages/testbed/Testbed.tsx"),
    route("about", "pages/about/About.mdx"),
    route("extras", "pages/extras/Extras.tsx"),
    route("*", "pages/NotFound.tsx"),
  ]),
  route("blog/:postId", "pages/blog/Post.tsx"),
  route("sitemap.xml", "sitemap.xml.server.ts"),
];

// use server build data
export const useBuild = () => {
  const data = useRouteLoaderData<typeof loader>("root");

  // flatten ServerRouteManifest into AgnosticRouteObject[] for matchRoutes
  const flatRoutes: RouteObject[] = Object.values(data?.routes ?? {}).map(
    (route) => ({
      id: route?.id,
      path: route?.path,
      index: route?.index,
      caseSensitive: route?.caseSensitive,
      parentId: route?.parentId,
    }),
  );

  return { ...data, flatRoutes };
};

// check if internal route exists
export const useRouteExists = (to: string) => {
  const { flatRoutes } = useBuild();
  return !!matchRoutes(flatRoutes, to);
};
