import "~/styles.css";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/figtree";
import "@fontsource-variable/sometype-mono";
import { useEffect } from "react";
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
import MathJax from "~/components/MathJax";
import Navigate from "~/components/Navigate";
import ViewCorner from "~/components/ViewCorner";
import { scrollTo } from "~/util/dom";
import { useChanged } from "~/util/hooks";

// app entrypoint
export default function App() {
  const { pathname, hash } = useLocation();

  const pathChanged = useChanged(pathname);
  const hashChanged = useChanged(hash);

  useEffect(() => {
    // if hash defined, scroll to it
    if (hash)
      scrollTo(
        hash,
        undefined,
        // if path changed (page load or new page), wait for layout shift
        // otherwise (e.g. user clicked toc link), scroll immediately
        pathChanged,
      );
  }, [hash, pathChanged, hashChanged]);

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
