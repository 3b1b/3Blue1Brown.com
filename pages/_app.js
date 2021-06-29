import { createContext } from "react";
import "../styles/global.scss";
import "katex/dist/katex.min.css";

export const PageContext = createContext({});

const App = ({ Component, pageProps }) => {
  // log page props, but only in browser, not in node
  if (typeof window !== "undefined") console.log({ pageProps });

  return (
    <PageContext.Provider value={pageProps}>
      <Component {...pageProps} />
    </PageContext.Provider>
  );
};

export default App;
