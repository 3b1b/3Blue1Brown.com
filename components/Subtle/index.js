import PropTypes from "prop-types";
import styles from "./index.module.scss";

// component for subtle, de-emphasized text
Subtle.propTypes = {
  children: PropTypes.node.isRequired,
};

export default function Subtle({ children }) {
  return <div className={styles.subtle}>{children}</div>;
}
