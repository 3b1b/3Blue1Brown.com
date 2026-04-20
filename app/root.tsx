import "~/styles.css";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/figtree";
import "@fontsource-variable/sometype-mono";
import type { Location } from "react-router";
import { useEffect, useRef } from "react";
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { IconContext } from "@phosphor-icons/react";
import Analytics from "~/components/Analytics";
import Celebrate from "~/components/Celebrate";
import { load as loadDarkMode } from "~/components/DarkMode";
import Link from "~/components/Link";
import MathJax from "~/components/MathJax";
import Navigate from "~/components/Navigate";
import ViewCorner from "~/components/ViewCorner";
import site from "~/data/site.json";
import { scrollTo } from "~/util/dom";
import { waitFor } from "~/util/misc";

// app entrypoint
export default function App() {
  // current route
  const location = useLocation();
  // previous route
  const previousLocation = useRef<Location>(null);

  // scroll to hash
  useEffect(() => {
    // if page load or new page
    if (location.pathname !== previousLocation.current?.pathname)
      (async () => {
        // wait for page to finish loading
        await waitFor(() => document.readyState === "complete");
        // wait for layout shifts to stabilize
        scrollTo(location.hash, undefined, true);
      })();
    // if just hash changed (e.g. user clicked TOC link), scroll immediately
    else if (location.hash !== previousLocation.current?.hash)
      scrollTo(location.hash, { behavior: "smooth", block: "start" });

    previousLocation.current = location;
  }, [location]);

  return (
    <IconContext.Provider value={{ className: "icon" }}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <Analytics />

          <script dangerouslySetInnerHTML={{ __html: loadDarkMode }} />

          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Links />
        </head>

        <body>
          <nav aria-label="jump">
            {/* jump button for accessibility */}
            <a
              href="#content"
              className="pointer-events-none fixed top-0 left-0 z-100 bg-white p-2 text-black no-underline not-focus-visible:opacity-0"
              tabIndex={0}
            >
              Jump to main content
            </a>
          </nav>

          <Outlet />
          <ViewCorner />
          <Navigate />
          <MathJax />
          <Celebrate />
          <ScrollRestoration getKey={(location) => location.pathname} />
          <Scripts />
        </body>
      </html>
    </IconContext.Provider>
  );
}

// app-wide error fallback
export function ErrorBoundary({ error }: { error: Error }) {
  // keep this simple to avoid errors in error boundary itself
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>

      <body>
        <main className="flex flex-col items-center justify-center-safe gap-8 p-12">
          <h1>Error</h1>
          <p>
            We're sorry, something went wrong. Please{" "}
            <Link to={site.github_issues}>let us know about it.</Link>
          </p>
          <p className="text-error">{error.stack}</p>
          <p>Open your browser's developer console for more details.</p>
        </main>
      </body>
    </html>
  );
}
