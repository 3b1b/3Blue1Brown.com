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
  id: PropTypes.string.isRequired,
};

// vertical card with image, text, and link
export default function FeatureCard({
  link,
  background,
  image,
  title,
  text,
  width = 300,
  height = 200,
  id,
}) {
  return (
    <a className={styles.feature_card} href={link} style={{ width }}>
      <div
        className={styles.image}
        style={{ maxHeight: height }}
        data-dark={background ? true : false}
        id={id}
      >
        {background && <img src={transformSrc(background)} alt="" />}
        <img src={transformSrc(image)} alt="" />
      </div>
      <div className={styles.text}>
        <Markdownify noParagraph={true}>{text}</Markdownify>
      </div>
    </a>
  );
}
