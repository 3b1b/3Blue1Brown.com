import { FeatherIcon } from "@phosphor-icons/react";
import Link from "~/components/Link";
import { posts } from "~/pages/blog/Post";

// list of blog posts
export default function Blog() {
  return (
    <section className="bg-secondary/10">
      <h2>Blog</h2>

      <div className="grid grid-cols-2 gap-8 max-sm:grid-cols-1">
        {Object.entries(posts).map(
          ([
            route,
            {
              frontmatter: { title = "", description = "", date = "" },
            },
          ]) => (
            <Link
              key={route}
              to={`/blog/${route.replace("./", "").replace("/index.mdx", "")}`}
              className="card items-start gap-1 overflow-hidden bg-gray/10 p-4 text-left"
            >
              <FeatherIcon className="absolute top-1/2 right-0 size-20 -translate-y-1/2 text-xl text-gray opacity-10" />
              <div className="font-sans font-medium">{title}</div>
              <div>{description}</div>
              <div>{date}</div>
            </Link>
          ),
        )}
      </div>
    </section>
  );
}
