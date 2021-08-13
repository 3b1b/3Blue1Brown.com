import styles from "./index.module.scss";

export default function BookShelf({ children }) {
  return <div className={styles.bookShelf}>{children}</div>;
}

export function Book({ url, image, title, author=""}) {
  return (
    <div>
      <a
        className={styles.book}
        href={url}
        target="_blank"
        rel="noreferrer"
        title={title}
      >
        <img src={image} alt={title || ""} />
      </a>
      <a
        href={url}
      >
        <div className={styles.title}> {title} </div>
      </a>
      <div className={styles.author}> {author ? "by " + author : ""} </div>
    </div>
  );
}
