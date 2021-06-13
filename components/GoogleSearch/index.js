import { useEffect } from "react";

const GoogleSearch = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=8dfbb53b83ef4c98e";
    document.body.append(script);
  }, []);

  return <div className="gcse-search" />;
};

export default GoogleSearch;
