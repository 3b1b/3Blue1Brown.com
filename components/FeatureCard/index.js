import PropTypes from "prop-types";
import Markdownify from "../Markdownify";
import styles from "./index.module.scss";
import { transformSrc } from "../../util/transformSrc";

FeatureCard.propTypes = {
  link: PropTypes.string.isRequired,
  background: PropTypes.string,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  id: PropTypes.string,
};

// vertical card with image, text, and link
export default function FeatureCard({
  link,
  background,
  image,
  title,
  text,
  width = 300,
  height = 300,
  id,
}) {
  // For cards with backgrounds (recruiting), create a horizontal layout with logo on left
  if (background) {
    return (
      <a className={styles.feature_card_horizontal} href={link} style={{ height }} id={id}>
        <div className={styles.logo_left} style={{ width: height, height }}>
          <img src={transformSrc(image)} alt="" />
        </div>
        <div className={styles.banner_right}>
          <div
            className={styles.background}
            style={{ backgroundImage: `url(${transformSrc(background)})` }}
          />
          <div className={styles.overlay} />
          <div className={styles.content}>
            <div className={styles.title}>{title}</div>
            <div className={styles.text}>
              <Markdownify noParagraph={true}>{text}</Markdownify>
            </div>
          </div>
        </div>
      </a>
    );
  }

  // Original vertical card layout (no background)
  return (
    <a className={styles.feature_card} href={link} style={{ width, height }}>
      <div className={styles.image} style={{ maxHeight: height }}>
        <img src={transformSrc(image)} alt="" />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.text}>
        <Markdownify noParagraph={true}>{text}</Markdownify>
      </div>
    </a>
  );
}
