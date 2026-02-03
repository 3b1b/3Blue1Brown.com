// site-wide meta
export const site = {
  title: "3Blue1Brown",
  description:
    "Mathematics with a distinct visual perspective. Linear algebra, calculus, neural networks, topology, and more.",
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
      <meta property="og:title" content={combinedTitle} />
      <meta name="description" content={combinedDescription} />
      <meta property="og:description" content={combinedDescription} />
    </>
  );
};
