import PropTypes from "prop-types";
import styles from "./index.module.scss";

Banner.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
  tagline: PropTypes.string,
};

export default function Banner({ src, alt = "", title, tagline }) {
  return (
    <div className={styles.banner}>
      <img src={src} alt={alt} />
      {(title || tagline) && (
        <div className={styles.overlay}>
          {title && <div className={styles.title}>{title}</div>}
          {tagline && (
            <div className={styles.tagline}>
              {tagline.split("").map((char, index) => (
                <span key={index}>{char === " " ? "\u00A0" : char}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
