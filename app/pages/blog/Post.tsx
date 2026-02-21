import type { MDXContent } from "mdx/types";
import type { Article } from "schema-dts";
import type { Route } from "./+types/Post";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Meta from "~/components/Meta";
import StrokeType from "~/components/StrokeType";
import Youtube from "~/components/Youtube";
import { formatDate } from "~/util/string";

type Frontmatter = {
  title?: string;
  date?: string;
  description?: string;
  author?: string;
  video?: string;
};

type Post = {
  default: MDXContent;
  frontmatter: Frontmatter;
};

// import all posts on prerender/buildtime and client/runtime
export const posts = import.meta.glob<Post>("./**/*.mdx", { eager: true });

export const loader = ({ params: { postId } }: Route.LoaderArgs) => {
  // path to mdx source file
  const path = `./${postId}/index.mdx`;
  const post = posts[path];
  if (!post) throw new Response("Not found", { status: 404 });
  return { path };
};

// blog post layout
export default function Post({ loaderData: { path } }: Route.ComponentProps) {
  const post = posts[path];
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
          <h1>
            <StrokeType>{title}</StrokeType>
          </h1>
          <div className="flex flex-col items-center gap-4">
            {description && <p className="text-lg">{description}</p>}
            <div className="flex flex-wrap gap-8 text-lg opacity-50">
              {author && <div>{author}</div>}
              {date && <div>{formatDate(date)}</div>}
            </div>
          </div>
          {video && <Youtube id={video} className="aspect-video w-full" />}
        </section>

        <Component />
      </main>
      <Footer />
    </>
  );
}
