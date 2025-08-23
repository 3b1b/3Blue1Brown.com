import Link from "next/link";
import styles from "./index.module.scss";
import PropTypes from "prop-types";

Teaser.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
  thumbnail: PropTypes.string,
};

export default function Teaser({ title, link, thumbnail }) {
  return (
    <Link href={link} className={styles.teaser}>
      <div className={styles.center}>
        <div className={styles.content}>
          {thumbnail && (
            <div className={styles.thumbnailContainer}>
              <img src={thumbnail} alt="" className={styles.thumbnail} />
            </div>
          )}
          <div className={styles.textContent}>
            <div className={styles.label}>
              Upcoming video (early view for patrons)
            </div>
            <div className={styles.title}>{title}</div>
          </div>
        </div>
      </div>
    </Link>
  );
}