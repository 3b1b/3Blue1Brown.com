import { useContext } from "react";
import PropTypes from "prop-types";
import { PageContext } from "../../pages/_app";
import { useSectionWidth } from "../Section";
import { transformSrc } from "../../util/transformSrc";
import styles from "./index.module.scss";

Portrait.propTypes = {
  image: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flip: PropTypes.bool,
  round: PropTypes.bool,
  caption: PropTypes.string,
};

// image that floats to left/right of text content, useful for pictures of people
export default function Portrait({ image, size = "180px", flip = false, round = true, caption }) {
  const { dir } = useContext(PageContext);
  const sectionWidth = useSectionWidth();

  // if no image, don't render
  if (!image) return null;

  return (
    <>
      <div className={styles.clearfix} />
      <div
        className={styles.portrait}
        style={{ width: size }}
        data-flip={flip}
        data-sectionwidth={sectionWidth}
      >
        <div
          className={styles.imageWrapper}
          style={{ width: size, height: size }}
          data-round={round}
        >
          <img src={transformSrc(image, dir)} />
        </div>
        {caption && <div className={styles.caption}>{caption}</div>}
      </div>
    </>
  );
}
