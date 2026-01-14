import PropTypes from "prop-types";
import styles from "./index.module.scss";

Banner.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
};

export default function Banner({ src, alt = "" }) {
  return (
    <div className={styles.banner}>
      <img src={src} alt={alt} />
    </div>
  );
}
