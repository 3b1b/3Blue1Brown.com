import allRoutes from "./routes.json" with { type: "json" };

const { FULL = "", ROUTE = "" } = process.env;

// paths to test
let routes = allRoutes.filter((path) => !path.endsWith(".xml"));

// if not running in "full" mode, only test subset of routes to save time
if (!FULL)
  routes = routes.filter(
    (path) => !path.includes("/lessons") && !path.includes("/blog"),
  );

// only test routes that match pattern
if (ROUTE) routes = routes.filter((path) => path.includes(ROUTE));

export default routes;
