import Clickable from "../Clickable";
import styles from "./index.module.scss";

// vertical card with image, text, and link
const FeatureCard = ({
  image,
  text,
  link,
  buttonIcon,
  buttonText,
  mini = false,
}) => (
  <div className={styles.feature_card} data-mini={mini}>
    <a className={styles.image} href={link}>
      <img src={image} />
    </a>
    <div className={styles.text}>{text}</div>
    <Clickable link={link} icon={buttonIcon} text={buttonText} />
  </div>
);

export default FeatureCard;
