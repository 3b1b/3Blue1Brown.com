import styles from "./index.module.scss";

const Spoiler = ({ children }) => (
  <span className={styles.spoiler}>{children}</span>
);

export default Spoiler;
