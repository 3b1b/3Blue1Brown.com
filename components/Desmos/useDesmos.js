import { createContext, useContext, useEffect, useState } from "react";
import Script from "next/script";
const DesmosContext = createContext({});

/**
 * This provider uses next/script to import the desmos API.
 * It provides the context with the desmos window object so
 * consumer components can call Desmos.GraphingCalculator() etc.
 *
 * The reason we use context here is to prevent duplicate loading
 * of desmos scripts when navigating between layouts.
 */
export const DesmosProvider = ({ children }) => {
  const VERSION = "1.7"; // Version to load
  const API_KEY = "dcb31709b452b1cf9dc26972add0fda6"; // Development Key
  const [desmos, setDesmos] = useState(null); // Desmos window object
  useEffect(() => {
    if (window.Desmos && !desmos) {
      setDesmos(window.Desmos);
    }
  }, [desmos]);
  return (
    <>
      {!desmos ? (
        <Script
          src={`https://www.desmos.com/api/v${VERSION}/calculator.js?apiKey=${API_KEY}`}
          lazyOnload
          onLoad={() => {
            setDesmos(window.Desmos);
          }}
        />
      ) : null}

      <DesmosContext.Provider value={desmos}>{children}</DesmosContext.Provider>
    </>
  );
};

// Hook to get the reference to window.Desmos
export const useDesmos = () => {
  const ctx = useContext(DesmosContext);
  if (ctx === undefined) {
    throw new Error("useDesmos must be used within DesmosProvider.");
  }
  return ctx;
};
