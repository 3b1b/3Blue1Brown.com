import styles from "./index.module.scss";

export default function BookShelf({ children }) {
  return <div className={styles.bookShelf}>{children}</div>;
}

export function Book({ url, image, title }) {
  return (
    <a
      className={styles.book}
      href={url}
      target="_blank"
      rel="noreferrer"
      title={title}
    >
      <img src={image} alt={title || ""} />
    </a>
  );
}
