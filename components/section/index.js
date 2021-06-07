import styles from "./index.module.scss";

const Section = ({ children, dark }) => (
  <section className={styles.section} data-dark={dark}>
    <div className={styles.wrapper}>{children}</div>
  </section>
);

export default Section;
