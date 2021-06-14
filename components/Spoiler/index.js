import styles from "./index.module.scss";

const Spoiler = ({ children }) => (
  <span className={styles.spoiler} tabIndex="0">
    {children}
  </span>
);

export default Spoiler;
