import allRoutes from "./routes.json" with { type: "json" };

// by default, ignore less critical and numerous routes (like /lessons and /blog) to speed up tests
const { ROUTE = "" } = process.env;

// function to filter routes by
const filter = ROUTE
  ? // filter by provided regex
    (path: string) => path.match(new RegExp(ROUTE))
  : // default filter
    (path: string) => {
      if (path.endsWith(".xml")) return false;

      // ignore less critical / more numerous routes to speed up tests
      if (["/lessons", "/blog"].some((p) => path.startsWith(p))) {
        // but still include representative sample of a few
        if (
          [
            // large, popular, complex, math-only controls
            "/essence-of-calculus",
            // large, interactive
            // interactive
            "/newtons-fractal",
            // no text, viz bg
            "/hilbert-curve",
            // no text
            "/laplace-transform/",
          ].some((p) => path.endsWith(p))
        )
          return true;
        return false;
      }

      return true;
    };
// pages on site to test
const routes = allRoutes.filter(filter);

export default routes;
