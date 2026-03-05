import { href } from "react-router";
import { FeatherIcon } from "@phosphor-icons/react";
import { orderBy } from "lodash-es";
import Card from "~/components/Card";
import { H2 } from "~/components/Heading";
import { posts } from "~/pages/blog/Post";
import { formatDate } from "~/util/string";

// list of blog posts
export default function Blog() {
  return (
    <section className="bg-secondary/10">
      <H2>Blog</H2>

      <div className="grid grid-cols-2 gap-8 max-sm:grid-cols-1">
        {orderBy(
          Object.entries(posts),
          ([, post]) => post.frontmatter.date,
          "desc",
        ).map(([id, post]) => {
          const { title = "", description = "", date = "" } = post.frontmatter;
          return (
            <Card
              key={id}
              to={href("/blog/:id", { id })}
              className="items-start gap-2 overflow-hidden bg-current/5 p-4 text-left"
              title={title}
              description={`${formatDate(date)} — ${description}`}
            >
              <FeatherIcon className="absolute top-1/2 right-0 size-20 -translate-y-1/2 text-xl text-gray opacity-10" />
            </Card>
          );
        })}
      </div>
    </section>
  );
}
