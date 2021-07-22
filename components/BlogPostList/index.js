import { useContext } from "react";
import { PageContext } from "../../pages/_app";
import Link from "next/link";
import { formatDate } from "../../util/locale";

export default function BlogPostList() {
  const { blogPosts } = useContext(PageContext);

  return (
    <ul>
      {blogPosts.map((post) => (
        <li>
          <Link href={`/blog/${post.slug}`}>
            <a>{post.title}</a>
          </Link>
          {post.date && <span>{formatDate(post.date)}</span>}
        </li>
      ))}
    </ul>
  );
}
