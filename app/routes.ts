import { index, route } from "@react-router/dev/routes";
import type { RouteConfig } from "@react-router/dev/routes";

export default [
  index("pages/Home.tsx"),
  route("testbed", "pages/Testbed.tsx"),
] satisfies RouteConfig;
