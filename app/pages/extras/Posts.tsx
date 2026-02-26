import { FeatherIcon } from "@phosphor-icons/react";
import { H2 } from "~/components/Heading";
import Link from "~/components/Link";
import { posts } from "~/pages/blog/Post";

// list of blog posts
export default function Posts() {
  return (
    <section className="bg-secondary/10">
      <H2>Blog</H2>

      <div className="grid grid-cols-2 gap-8 max-sm:grid-cols-1">
        {Object.entries(posts).map(([id, post]) => {
          const { title = "", description = "", date = "" } = post.frontmatter;
          return (
            <Link
              key={id}
              to={`/blog/${id}`}
              className="card items-start gap-2 overflow-hidden bg-current/5 p-4 text-left"
            >
              <FeatherIcon className="absolute top-1/2 right-0 size-20 -translate-y-1/2 text-xl text-gray opacity-10" />
              <div className="font-sans font-medium">{title}</div>
              <div>{description}</div>
              <div>{date}</div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
