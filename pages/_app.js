import { useEffect, createContext } from "react";
import { useRouter } from "next/router";
import NextProgress from "next-progress";
import * as gtag from "../util/gtag";
import "../styles/global.scss";

export const PageContext = createContext({});

const App = ({ Component, pageProps }) => {
  // Log client-side route changes to Google Analytics
  const router = useRouter();
  useEffect(() => {
    const handleRouteChange = (url) => {
      if (
        process.env.NODE_ENV === "production" &&
        typeof window !== "undefined" &&
        window.location.hostname !== "location" &&
        gtag
      ) {
        gtag.pageview(url);
      }
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  return (
    <PageContext.Provider value={pageProps}>
      <NextProgress color="#74c0e3" height="3px" />

      <Component {...pageProps} />
    </PageContext.Provider>
  );
};

export default App;
