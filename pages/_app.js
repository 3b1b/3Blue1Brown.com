import { createContext } from "react";
import "../styles/global.scss";
import "katex/dist/katex.min.css";

export const PageContext = createContext({});

const App = ({ Component, pageProps }) => {
  return (
    <PageContext.Provider value={pageProps}>
      <Component>{pageProps.children}</Component>
    </PageContext.Provider>
  );
};

export default App;
