import PropTypes from "prop-types";
import styles from "./index.module.scss";

Float.propTypes = {
  image: PropTypes.string,
  side: PropTypes.oneOf(["left", "right"]),
};

// basic floating image
export default function Float({ image = "", side = "left" }) {
  return (
    <img className={styles.image} src={image} style={{ float: side }} alt="" />
  );
}
