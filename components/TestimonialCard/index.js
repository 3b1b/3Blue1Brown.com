import PropTypes from "prop-types";
import Markdownify from "../Markdownify";
import styles from "./index.module.scss";

TestimonialCard.propTypes = {
  text: PropTypes.string.isRequired,
  attribution: PropTypes.string.isRequired,
};

// vertical card with text and attribution
export default function TestimonialCard({ text, attribution }) {
  return (
    <div className={styles.testimonial_card}>
      <div className={styles.text}>
        <Markdownify>{text}</Markdownify>
      </div>
      <div className={styles.attribution}>{attribution}</div>
    </div>
  );
}
