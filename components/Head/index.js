import { useContext } from "react";
import NextHead from "next/head";
import { title as siteTitle } from "../../data/site.yaml";
import { description as siteDescription } from "../../data/site.yaml";
import { location as siteLocation } from "../../data/site.yaml";
import { PageContext } from "../../pages/_app";

const Head = () => {
  let { title, description, location, thumbnail } = useContext(PageContext);

  title = [siteTitle, title].filter((e) => e).join(" - ");
  description = description || siteDescription;
  location = location || siteLocation;

  return (
    <NextHead>
      <title>{title}</title>

      {/* metadata */}
      <meta name="title" content={title} />
      <meta name="description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={location} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={location} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />


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
