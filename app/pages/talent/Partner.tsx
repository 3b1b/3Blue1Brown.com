import type { MDXContent } from "mdx/types";
import type { Route } from "./+types/Partner";
import Footer from "~/components/Footer";
import { H1 } from "~/components/Heading";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import Message from "~/pages/talent/Message";
import PartnerHeader from "~/pages/talent/PartnerHeader";
import { importAssets } from "~/util/import";

// frontmatter of partner import (before any transformation)
type RawPartnerFrontmatter = {
  name?: string;
  tagline?: string;
  // free-form line about where they work, e.g. "San Francisco + remote"
  location?: string;
  // link to partner's open roles
  apply?: string;
  quote?: string;
  color?: string;
  // interview video, previewed on gallery. youtube id, or vimeo id (+ hash if private)
  youtube?: string;
  vimeo?: string;
  vimeoHash?: string;
};

// partner import (before any transformation)
type RawPartner = {
  default: MDXContent;
  frontmatter: RawPartnerFrontmatter;
};

// import all partners
export const [getPartner] = importAssets(
  import.meta.glob<RawPartner>("./**/index.mdx", { eager: true }),
);

// import all "message from grant" files, rendered on page and previewed on gallery
export const [getMessage] = importAssets(
  import.meta.glob<{ default: MDXContent }>("./**/message.mdx", {
    eager: true,
  }),
  "message",
);

// import all challenge teasers, previewed on gallery
export const [getChallenge] = importAssets(
  import.meta.glob<{ default: MDXContent }>("./**/challenge.mdx", {
    eager: true,
  }),
  "challenge",
);

// every partner's wordmark, in both variants. globbed once, keyed twice below
const wordmarks = import.meta.glob<{ default: string }>(
  "./**/wordmark*.{svg,png}",
  { eager: true },
);

// import all wordmarks
export const [getWordmark] = importAssets(
  wordmarks,
  "wordmark",
  (module) => module.default,
);

// import all light-on-dark wordmarks (for dark mode, and dark partner sections)
export const [getWordmarkDark] = importAssets(
  wordmarks,
  "wordmark-dark",
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

      <Main className="striped">
        <H1 className="sr-only">{name}</H1>
        <Component />
        <Message id={id} />
      </Main>

      <Footer />
    </>
  );
}
