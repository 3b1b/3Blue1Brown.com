import Markdownify from "../Markdownify";
import styles from "./index.module.scss";

// vertical card with image, text, and link
const FeatureCard = ({
  link,
  image,
  title,
  text,
  width = 300,
  height = 200,
}) => (
  <a className={styles.feature_card} href={link} style={{ width }}>
    <div className={styles.image} style={{ maxHeight: height }}>
      <img src={image} />
    </div>
    <div className={styles.title}>{title}</div>
    <div className={styles.text}>
      <Markdownify noParagraph={true}>{text}</Markdownify>
    </div>
  </a>
);

export default FeatureCard;
