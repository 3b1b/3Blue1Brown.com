import type { MDXContent } from "mdx/types";
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

export default function Partner() {
  return (
    <>
      <p>Partner page</p>
    </>
  );
}
