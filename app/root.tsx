import "~/styles.css";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/figtree";
import "@fontsource-variable/sometype-mono";
import {
  Links,
  Outlet,
  Scripts,
  ScrollRestoration,
  useLocation,
} from "react-router";
import { IconContext } from "@phosphor-icons/react";
import { scrollToSelector } from "~/util/dom";
import { useChanged } from "~/util/hooks";

// app entrypoint
export default function App() {
  // current route info
  const { hash, pathname, search } = useLocation();

  // did any key part of url change
  const changed = useChanged({ pathname, search, hash });
  // did hash change
  const hashChanged = useChanged(hash);

  if (changed)
    // if just hash changed, scroll immediately. else, wait for layout shifts
    scrollToSelector(hash, undefined, hashChanged);

  return (
    <IconContext.Provider value={{ className: "icon" }}>
      <html lang="en" suppressHydrationWarning>
        <head>
          <script>
            {`
              // set dark mode immediately to prevent FOUC
              const dark = localStorage.getItem("dark-mode") === "true";
              const root = document.documentElement;
              root.classList[dark ? "add" : "remove"]("dark");
            `}
          </script>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Links />
        </head>
        <body>
          <Outlet />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </IconContext.Provider>
  );
}
