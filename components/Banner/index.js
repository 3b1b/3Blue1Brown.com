import PropTypes from "prop-types";
import styles from "./index.module.scss";

Banner.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  title: PropTypes.string,
  tagline: PropTypes.string,
  tagline_break: PropTypes.number,
  character: PropTypes.string,
};

export default function Banner({ src, alt = "", title, tagline, tagline_break, character }) {
  const renderTagline = () => {
    if (!tagline) return null;

    const chars = tagline.split("").map((char, index) => (
      <span key={index}>{char === " " ? "\u00A0" : char}</span>
    ));

    // Insert a mobile-only line break at the specified position
    if (tagline_break !== undefined && tagline_break < chars.length) {
      chars.splice(tagline_break, 0, <br key="break" className={styles.mobileBreak} />);
    }

    return chars;
  };

  return (
    <div className={styles.banner}>
      <img src={src} alt={alt} className={styles.backgroundImage} />
      {(title || tagline) && (
        <div className={styles.overlay}>
          {title && <div className={styles.title}>{title}</div>}
          {tagline && (
            <div className={styles.tagline}>
              {renderTagline()}
            </div>
          )}
        </div>
      )}
      {character && (
        <img src={character} alt="" className={styles.character} />
      )}
    </div>
  );
}
