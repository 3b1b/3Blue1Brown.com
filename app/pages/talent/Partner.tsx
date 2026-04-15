import type { MDXContent } from "mdx/types";
import type { Route } from "./+types/Partner";
import Footer from "~/components/Footer";
import { H1 } from "~/components/Heading";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import PartnerHeader from "~/pages/talent/PartnerHeader";
import { importAssets } from "~/util/import";

type PartnerFrontmatter = {
  name?: string;
  tagline?: string;
  quote?: string;
  color?: string;
};

type Partner = {
  default: MDXContent;
  frontmatter: PartnerFrontmatter;
};

// import all partners
export const [getPartner, partners] = importAssets(
  import.meta.glob<Partner>("./**/index.mdx", { eager: true }),
);

// import all logos
export const [getLogo, logos] = importAssets(
  import.meta.glob<{ default: string }>("./**/*.{svg,png}", { eager: true }),
  "logo",
  (module) => module.default,
);

// partner page layout
export default function Partner({ params: { id } }: Route.ComponentProps) {
  const partner = getPartner(id);

  if (!partner) return null;

  const {
    // get component to render
    default: Component,
    // get frontmatter
    frontmatter: { name = "" },
  } = partner;

  return (
    <>
      <Meta title={name} />

      <PartnerHeader />

      <Main striped>
        <H1 className="sr-only">Jane Street</H1>
        <Component />
      </Main>

      <Footer />
    </>
  );
}
