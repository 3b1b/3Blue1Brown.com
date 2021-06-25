import styles from "./index.module.scss";

// circular image that floats to left/right of text content, useful for pictures
// of people
const Portrait = ({ image, size = "180px", flip = false }) => {
  // if no image, don't render
  if (!image) return null;

  return (
    <div
      className={styles.portrait}
      style={{ width: size, height: size }}
      data-flip={flip}
    >
      <img src={image} />
    </div>
  );
};

export default Portrait;
