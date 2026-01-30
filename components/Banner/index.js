import PropTypes from "prop-types";
import styles from "./index.module.scss";

Banner.propTypes = {
  bg: PropTypes.element.isRequired,
  title: PropTypes.string,
  tagline: PropTypes.string,
  character: PropTypes.string,
};

export default function Banner({
  bg,
  title,
  tagline,
  character,
}) {
  return (
    <div className={styles.banner}>
      {bg}
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
      {character && <img src={character} alt="" className={styles.character} />}
    </div>
  );
}
