// site-wide meta
export const site = {
  title: "3Blue1Brown",
  subtitle: "Intuitive, animated math",
  description:
    "Mathematics with a distinct visual perspective. Linear algebra, calculus, neural networks, topology, and more.",
  url: "https://3blue1brown.com",
};

type Props = {
  title?: string | string[];
  description?: string;
};

// conveniently set page meta
export const Meta = ({ title, description }: Props) => {
  const combinedTitle = [title, site.title].flat().filter(Boolean).join(" | ");

  const combinedDescription = (description || site.description).trim();

  return (
    <>
      <title>{combinedTitle}</title>

      <meta name="title" content={combinedTitle} />
      <meta name="description" content={combinedDescription} />
      <link rel="icon" type="image/svg" href="/icon.svg" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={site.url} />
      <meta property="og:title" content={combinedTitle} />
      <meta property="og:description" content={combinedDescription} />
      <meta property="og:image" content="/share.jpg" />
    </>
  );
};
