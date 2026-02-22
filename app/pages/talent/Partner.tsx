import type { MDXContent } from "mdx/types";
import type { Route } from "./+types/Partner";
import Footer from "~/components/Footer";
import Meta from "~/components/Meta";
import Banner from "~/pages/talent/Banner";
import { importAssets } from "~/util/import";

type Frontmatter = {
  name?: string;
  tagline?: string;
  quote?: string;
  color?: string;
};

type Partner = {
  default: MDXContent;
  frontmatter: Frontmatter;
};

// import all partners
export const [getPartner, partners] = importAssets(
  import.meta.glob<Partner>("./**/*.mdx", { eager: true }),
);

// import all logos
export const [getLogo, logos] = importAssets(
  import.meta.glob<{ default: string }>("./**/*.{svg,png}", { eager: true }),
  "logo",
);

// import all banners
export const [getBanner, banners] = importAssets(
  import.meta.glob<{ default: string }>("./**/*.jpg", { eager: true }),
  "banner",
);

// import all wordmarks
export const [getWordmark, wordmarks] = importAssets(
  import.meta.glob<{ default: string }>("./**/*.svg", { eager: true }),
  "wordmark",
);

export default function Partner({ params: { id } }: Route.ComponentProps) {
  const partner = getPartner(id);
  const logo = getLogo(id);
  const banner = getBanner(id);
  const wordmark = getWordmark(id);

  if (!partner || !logo || !banner || !wordmark) return null;

  const {
    // get component to render
    default: Component,
    // get frontmatter
    frontmatter: { name = "" },
  } = partner;

  return (
    <>
      <Meta title={name} />

      <Banner name={name} banner={banner.default} wordmark={wordmark.default} />

      <main id="content" className="[&>section]:odd:bg-off-white">
        <h1 className="sr-only">{name}</h1>

        <Component />
      </main>

      <Footer />
    </>
  );
}
