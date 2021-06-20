import styles from "./index.module.scss";

const Portrait = ({ image, size = "180px", flip = false }) => (
  <div
    className={styles.portrait}
    style={{ width: size, height: size }}
    data-flip={flip}
  >
    <img src={image} />
  </div>
);

export default Portrait;
