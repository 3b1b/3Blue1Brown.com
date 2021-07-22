import Link from "next/link";
import NormalLayout from "../../layouts/NormalLayout";
import Section from "../../components/Section";
import { formatDate } from "../../util/locale";

import { blogMeta } from "../../util/pages";

export default function BlogHome({ blogMeta }) {
  return (
    <NormalLayout>
      <Section>
        <h1>Blog</h1>
        <ul>
          {blogMeta.map((post) => (
            <li>
              <Link href={`/blog/${post.slug}`}>
                <a>{post.title}</a>
              </Link>
              {post.date && <span>{formatDate(post.date)}</span>}
            </li>
          ))}
        </ul>
      </Section>
    </NormalLayout>
  );
}

export async function getStaticProps() {
  return {
    props: {
      blogMeta,
    },
  };
}
