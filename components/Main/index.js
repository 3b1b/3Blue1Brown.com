import styles from "./index.module.scss";

// simple wrapper component for main section of page
const Main = ({ children }) => <main className={styles.main}>{children}</main>;

export default Main;
