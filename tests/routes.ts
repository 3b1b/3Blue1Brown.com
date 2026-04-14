import allRoutes from "./routes.json" with { type: "json" };

// by default, ignore less critical and numerous routes (like /lessons and /blog) to speed up tests
const { ROUTE = "^(?!.*(\/lessons|\/blog))" } = process.env;

// pages on site to test
const routes = allRoutes
  // always ignore some files
  .filter((path) => !path.endsWith(".xml"))
  // only test routes that match pattern
  .filter((path) => path.match(new RegExp(ROUTE)));

export default routes;
