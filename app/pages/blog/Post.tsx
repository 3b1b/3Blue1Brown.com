import type { MDXContent } from "mdx/types";
import type { Article } from "schema-dts";
import type { Route } from "./+types/Post";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { H1 } from "~/components/Heading";
import Meta from "~/components/Meta";
import StrokeType from "~/components/StrokeType";
import YouTube from "~/components/YouTube";
import { importAssets } from "~/util/import";
import { formatDate } from "~/util/string";

type PostFrontmatter = {
  title?: string;
  date?: string;
  description?: string;
  author?: string;
  video?: string;
};

type Post = {
  default: MDXContent;
  frontmatter: PostFrontmatter;
};

// import all posts
export const [getPost, posts] = importAssets(
  import.meta.glob<Post>("./**/index.mdx", { eager: true }),
);

// blog post page layout
export default function Post({ params: { id } }: Route.ComponentProps) {
  const post = getPost(id);
  if (!post) return;

  const {
    // get component to render
    default: Component,
    // get frontmatter
    frontmatter: {
      title = "",
      date = "",
      description = "",
      author = "Grant Sanderson",
      video = "",
    },
  } = post;

  return (
    <>
      <Header />
      <main id="content" className="[&>section]:odd:bg-off-white">
        <Meta<Article>
          title={title}
          description={description}
          jsonLd={{
            "@context": "https://schema.org",
            "@type": "Article",
            headline: title,
            description,
            author,
            datePublished: date,
          }}
        />

        <section className="items-center gap-8 bg-theme/10!">
          <H1>
            <StrokeType>{title}</StrokeType>
          </H1>
          <div className="flex flex-col items-center gap-4">
            {description && <p className="text-lg">{description}</p>}
            <div className="flex flex-wrap gap-8 text-lg opacity-50">
              {author && <div>{author}</div>}
              {date && <div>{formatDate(date)}</div>}
            </div>
          </div>
          {video && <YouTube id={video} />}
        </section>

        <Component />
      </main>
      <Footer />
    </>
  );
}
