import Link from "next/link";
import styles from "./index.module.scss";
import PropTypes from "prop-types";

Teaser.propTypes = {
  title: PropTypes.string.isRequired,
  link: PropTypes.string.isRequired,
};

export default function Teaser({ title, link }) {
  return (
    <Link href={link} className={styles.teaser}>
      <div className={styles.center}>
        <div className={styles.content}>
          <div className={styles.label}>
            Upcoming video (early view for patrons)
          </div>
          <div className={styles.title}>{title}</div>
        </div>
      </div>
    </Link>
  );
}