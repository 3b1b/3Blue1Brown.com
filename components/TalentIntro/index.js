import PropTypes from "prop-types";
import styles from "./index.module.scss";

TalentIntro.propTypes = {
  image: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default function TalentIntro({ image, children }) {
  return (
    <div className={styles.talentIntro}>
      <div className={styles.imageContainer}>
        <img src={image} alt="" className={styles.image} />
      </div>
      <div className={styles.text}>{children}</div>
    </div>
  );
}
