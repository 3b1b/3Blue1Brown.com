import { useEffect } from "react";

// embedded google search component
const GoogleSearch = () => {
  // add script to body after page load
  // putting snippet into <Head> doesn't work for some reason
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://cse.google.com/cse.js?cx=8dfbb53b83ef4c98e";
    document.body.append(script);
  }, []);

  return <div className="gcse-search" />;
};

export default GoogleSearch;
