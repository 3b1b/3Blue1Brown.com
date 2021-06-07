import NextHead from "next/head";

import { title as siteTitle } from "../../vars.yaml";
import { description as siteDescription } from "../../vars.yaml";
import { location as siteLocation } from "../../vars.yaml";

const Head = ({ title, description, location, video }) => {
  title = [siteTitle, title].filter((e) => e).join(" - ");
  description = description || siteDescription;
  location = location || siteLocation;

  return (
    <NextHead>
      <title>{title}</title>
      <Meta {...{ title, description, location }} />
      <Fonts />
      <Favicons video={video} />
    </NextHead>
  );
};

export default Head;

const Meta = ({ title, description, location }) => (
  <>
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
  </>
);

const Fonts = () => (
  <>
    <link
      href="https://use.fontawesome.com/releases/v5.13.1/css/all.css"
      rel="stylesheet"
    />
    <link rel="preconnect" href="https://fonts.gstatic.com" />
    <link
      href="https://fonts.googleapis.com/css2?family=Cousine:ital,wght@0,400;0,700;1,400;1,700&family=Lora:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&family=Poppins:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600;1,700&display=swap"
      rel="stylesheet"
    />
  </>
);

const Favicons = ({ video }) => {
  const thumbnail = video
    ? `https://img.youtube.com/vi/${video}/hqdefault.jpg`
    : "favicons/share-thumbnail.jpg";

  return (
    <>
      <link rel="apple-touch-icon" sizes="180x180" href="favicons/ios.png" />
      <link
        rel="icon"
        type="image/png"
        sizes="512x512"
        href="favicons/favicon.png"
      />

      <link rel="manifest" href="favicons/site.webmanifest" />

      <meta property="og:image" content={thumbnail} />
      <meta property="twitter:image" content={thumbnail} />
    </>
  );
};
