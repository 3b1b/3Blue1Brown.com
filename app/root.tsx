import "~/styles.css";
import "@fontsource-variable/source-serif-4";
import "@fontsource-variable/figtree";
import "@fontsource-variable/sometype-mono";
import { IconContext } from "@phosphor-icons/react";
import { Links, Outlet, Scripts, ScrollRestoration } from "react-router";
import Footer from "~/components/Footer";
import Header from "~/components/Header";

// app entrypoint
export default function App() {
  return (
    <IconContext.Provider value={{ className: "icon" }}>
      <html lang="en">
        <head>
          <script>
            {`
              // set dark mode immediately to prevent FOUC
              const dark = localStorage.getItem("darkMode") === "true";
              const root = document.documentElement;
              root.classList[dark ? "add" : "remove"]("dark");
            `}
          </script>
          <meta charSet="utf-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
          <Links />
        </head>
        <body>
          <Header />
          <main>
            <Outlet />
          </main>
          <Footer />
          <ScrollRestoration />
          <Scripts />
        </body>
      </html>
    </IconContext.Provider>
  );
}
