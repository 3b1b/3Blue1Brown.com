import PropTypes from "prop-types";
import styles from "./index.module.scss";

Spoiler.propTypes = {
  children: PropTypes.node.isRequired,
};

// blacked-out span of text that reveals itself on hover/focus
export default function Spoiler({ children }) {
  return (
    <span className={styles.spoiler} tabIndex="0">
      {children}
    </span>
  );
}
