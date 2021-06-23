import styles from "./index.module.scss";

// blacked-out span of text that reveals itself on hover/focus
const Spoiler = ({ children }) => (
  <span className={styles.spoiler} tabIndex="0">
    {children}
  </span>
);

export default Spoiler;
