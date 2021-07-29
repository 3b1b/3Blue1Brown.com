import { useEffect, createContext } from "react";
import { useRouter } from "next/router";
import * as gtag from "../util/gtag";
import "../styles/global.scss";
import "katex/dist/katex.min.css";

export const PageContext = createContext({});

const App = ({ Component, pageProps }) => {
  // log page props, but only in browser, not in node
  if (typeof window !== "undefined") console.log({ pageProps });

  // Log client-side route changes to Google Analytics
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <PageContext.Provider value={pageProps}>
      <Component {...pageProps} />
    </PageContext.Provider>
  );
};

export default App;
