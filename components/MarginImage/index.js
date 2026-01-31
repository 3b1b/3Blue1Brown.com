import PropTypes from "prop-types";
import styles from "./index.module.scss";

MarginImage.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

export default function MarginImage({ src, alt = "" }) {
  return (
    <div className={styles.container}>
      <img src={src} alt={alt} className={styles.image} />
    </div>
  );
}
