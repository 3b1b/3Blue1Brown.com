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
  ]),
  layout("pages/talent/Layout.tsx", [
    route("talent", "pages/talent/Talent.tsx"),
  ]),
  layout("pages/lessons/Layout.tsx", [
    route("lessons/:lessonId", "pages/lessons/Lessons.tsx"),
  ]),
];

// use flat list of all (statically) available routes
export const useRoutes = () => {
  const data = useRouteLoaderData<typeof loader>("root");
  const manifest = data?.routes ?? {};
  // flatten ServerRouteManifest into AgnosticRouteObject[] for matchRoutes
  const flat: RouteObject[] = Object.values(manifest).map((route) => ({
    id: route?.id,
    path: route?.path,
    index: route?.index,
    caseSensitive: route?.caseSensitive,
    parentId: route?.parentId,
  }));

  return flat;
};

// check if internal route exists
export const useRouteExists = (to: string) => {
  const routes = useRoutes();
  return !!matchRoutes(routes, to);
};
