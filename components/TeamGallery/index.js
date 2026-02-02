import PropTypes from "prop-types";
import styles from "./index.module.scss";

TeamGallery.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function TeamGallery({ children }) {
  return <div className={styles.gallery}>{children}</div>;
}
