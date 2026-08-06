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
  // place of work, e.g. "San Francisco + remote"
  location?: string;
  // link to open roles
  apply?: string;
  about?: string;
  color?: string;
  // interview videos
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

// import all "messages from grant"
export const [getMessage] = importAssets(
  import.meta.glob<{ default: MDXContent }>("./**/message.mdx", {
    eager: true,
  }),
  "message",
);

// import all challenge teasers
export const [getChallenge] = importAssets(
  import.meta.glob<{ default: MDXContent }>("./**/challenge.mdx", {
    eager: true,
  }),
  "challenge",
);

// import all wordmarks, light/dark
const wordmarks = import.meta.glob<{ default: string }>(
  "./**/wordmark*.{svg,png}",
  { eager: true },
);

// wordmarks
export const [getWordmark] = importAssets(
  wordmarks,
  "wordmark",
  (module) => module.default,
);

// dark mode wordmarks
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
