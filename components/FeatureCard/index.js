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
  // For cards with backgrounds (recruiting), use full width, otherwise use specified width
  const cardStyle = background ? { height } : { width, height };

  return (
    <a className={styles.feature_card} href={link} style={cardStyle} id={id}>
      {background && (
        <div
          className={styles.background}
          style={{ backgroundImage: `url(${transformSrc(background)})` }}
        />
      )}
      <div className={styles.overlay} />
      <div className={styles.content}>
        <div className={styles.logo}>
          <img src={transformSrc(image)} alt="" />
        </div>
        <div className={styles.title}>{title}</div>
        <div className={styles.text}>
          <Markdownify noParagraph={true}>{text}</Markdownify>
        </div>
      </div>
    </a>
  );
}
