import styles from "./index.module.scss";

const Chip = ({ text, icon, mini = false, tooltip }) => (
  <span className={styles.chip} data-mini={mini}>
    {icon && <i className={icon} />}
    {text}
  </span>
);

export default Chip;
