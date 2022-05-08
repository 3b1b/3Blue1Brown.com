import PropTypes from "prop-types";
import { useSectionWidth } from "../Section";
import { transformSrc } from "../../util/transformSrc";
import styles from "./index.module.scss";
import Image from "next/image";

Portrait.propTypes = {
  alt: PropTypes.string,
  image: PropTypes.string.isRequired,
  size: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  flip: PropTypes.bool,
};

// circular image that floats to left/right of text content, useful for pictures
// of people
export default function Portrait({
  image,
  size = "180px",
  flip = false,
  alt = "",
}) {
  const sectionWidth = useSectionWidth();

  // if no image, don't render
  if (!image) return null;

  return (
    <>
      <div className={styles.clearfix} />
      <div
        className={styles.portrait}
        style={{ width: size, height: size }}
        data-flip={flip}
        data-sectionwidth={sectionWidth}
      >
        <Image alt={alt} src={"/" + transformSrc(image)} layout="fill" />
      </div>
    </>
  );
}
