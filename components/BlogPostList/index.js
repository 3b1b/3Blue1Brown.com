import { useContext } from "react";
import { PageContext } from "../../pages/_app";
import Link from "next/link";
import { formatDate } from "../../util/locale";
import styles from "./index.module.scss";

export default function BlogPostList() {
  const { blogPosts } = useContext(PageContext);

  return (
    <ul className={styles.postList}>
      {blogPosts.map((post) => (
        <li className={styles.postLink}>
          <Link href={`/blog/${post.slug}`}>
            <a className={styles.postTitle}>{post.title}</a>
          </Link>
          {post.date && (
            <>
              <span className={styles.bullet}>&bull;</span>
              <span className={styles.postDate}>{formatDate(post.date)}</span>
            </>
          )}
        </li>
      ))}
    </ul>
  );
}
