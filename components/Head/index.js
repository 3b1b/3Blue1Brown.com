import { useContext } from "react";
import NextHead from "next/head";
import { title as siteTitle } from "../../data/site.yaml";
import { description as siteDescription } from "../../data/site.yaml";
import { location as siteLocation } from "../../data/site.yaml";
import { PageContext } from "../../pages/_app";

const Head = () => {
  let { title, description, location, thumbnail } = useContext(PageContext);

  // Apply site title formatting and defaults
  const finalTitle = [siteTitle, title].filter((e) => e).join(" - ");
  const finalDescription = description || siteDescription;
  const finalLocation = location || siteLocation;

  return (
    <NextHead>
      <title>{finalTitle}</title>

      {/* metadata */}
      <meta name="title" content={finalTitle} />
      <meta name="description" content={finalDescription} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={finalLocation} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={finalLocation} />
      <meta property="twitter:title" content={finalTitle} />
      <meta property="twitter:description" content={finalDescription} />

      {/* fonts */}
      <link
        href="https://use.fontawesome.com/releases/v6.7.1/css/all.css"
        rel="stylesheet"
      />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Cousine:ital,wght@0,400;0,700;1,400;1,700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
        rel="stylesheet"
      />

      {/* favicons */}
      <link rel="apple-touch-icon" sizes="180x180" href="favicons/ios.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href="/favicons/favicon.png"
      />
      <link rel="manifest" href="/favicons/site.webmanifest" />
      <meta property="og:image" content={thumbnail} />
      <meta property="twitter:image" content={thumbnail} />
    </NextHead>
  );
};

export default Head;
