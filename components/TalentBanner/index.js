import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

TalentBanner.propTypes = {
  bg: PropTypes.node.isRequired,
  title: PropTypes.string,
  tagline: PropTypes.string,
  tagline_break: PropTypes.number,
  character: PropTypes.string,
  children: PropTypes.node,
};

export default function TalentBanner({
  bg,
  title,
  tagline,
  tagline_break,
  character,
  children,
}) {
  const [isOpen, setIsOpen] = useState(false);

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
    <div className={styles.container}>
      <div className={styles.banner}>
        {bg}
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
        {children && (
          <button
            className={styles.accordionTrigger}
            onClick={() => setIsOpen(!isOpen)}
            aria-expanded={isOpen}
          >
            <span>What is this?</span>
            <span className={`${styles.arrow} ${isOpen ? styles.arrowOpen : ""}`}>
              ▼
            </span>
          </button>
        )}
        {character && (
          <img src={character} alt="" className={styles.character} />
        )}
      </div>
      {children && (
        <div
          className={`${styles.accordionContent} ${isOpen ? styles.accordionOpen : ""}`}
        >
          <div className={styles.accordionInner}>
            {children}
          </div>
        </div>
      )}
    </div>
  );
}
