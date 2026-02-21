import type { Thing, WithContext } from "schema-dts";
import { JsonLd } from "react-schemaorg";
import site from "~/data/site.yaml";

type Props<Type extends Thing> = {
  title?: string | string[];
  description?: string;
  jsonLd?: WithContext<Type>;
};

// conveniently set page meta
export default function Meta<Type extends Thing>({
  title,
  description,
  jsonLd,
}: Props<Type>) {
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

      {jsonLd && <JsonLd<Type> item={jsonLd} />}
    </>
  );
}
