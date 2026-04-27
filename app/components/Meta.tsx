import type { Thing, WithContext } from "schema-dts";
import { useLocation } from "react-router";
import { JsonLd } from "react-schemaorg";
import { truncate } from "lodash-es";
import site from "~/data/site.json";

type Props<Type extends Thing> = {
  // page title parts
  title?: string | string[];
  // page description
  description?: string;
  // structured data
  jsonLd?: WithContext<Type>;
};

// conveniently set page meta
export default function Meta<Type extends Thing>({
  title,
  description,
  jsonLd,
}: Props<Type>) {
  const { pathname } = useLocation();
  const canonicalUrl = new URL(pathname, site.url).href;

  const combinedTitle = [title, site.title]
    .flat()
    .filter(Boolean)
    .map((part) => truncate(part, { length: 50 }))
    .join(" | ");

  const combinedDescription = (description || site.description).trim();

  return (
    <>
      <title>{combinedTitle}</title>

      <link rel="canonical" href={canonicalUrl} />
      <meta name="title" content={combinedTitle} />
      <meta name="description" content={combinedDescription} />
      <link rel="icon" type="image/svg" href="/icon.svg" />

      <meta property="og:type" content="website" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:title" content={combinedTitle} />
      <meta property="og:description" content={combinedDescription} />
      <meta property="og:image" content="/share.jpg" />

      {/*  json schema seo metadata */}
      {jsonLd && <JsonLd<Type> item={jsonLd} />}
    </>
  );
}
