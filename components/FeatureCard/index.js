import PropTypes from "prop-types";
import Markdownify from "../Markdownify";
import styles from "./index.module.scss";
import { transformSrc } from "../../util/transformSrc";
import Image from "next/image";

FeatureCard.propTypes = {
  link: PropTypes.string.isRequired,
  image: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
};

// vertical card with image, text, and link
export default function FeatureCard({
  link,
  image,
  title,
  text,
  width = 300,
  height = 200,
}) {
  return (
    <a className={styles.feature_card} href={link} style={{ width }}>
      <div
        className={styles.image}
        style={{ height: 150, position: "relative" }}
      >
        <Image
          src={"/" + transformSrc(image)}
          layout="fill"
          alt="Featured Card Image"
        />
      </div>
      <div className={styles.title}>{title}</div>
      <div className={styles.text}>
        <Markdownify noParagraph={true}>{text}</Markdownify>
      </div>
    </a>
  );
}
