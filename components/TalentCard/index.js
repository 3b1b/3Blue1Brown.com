import PropTypes from "prop-types";
import styles from "./index.module.scss";

TalentCard.propTypes = {
  logo: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  tagline: PropTypes.string.isRequired,
  slug: PropTypes.string.isRequired,
  quote: PropTypes.string,
};

export default function TalentCard({ logo, name, tagline, slug, quote }) {
  return (
    <a className={styles.talent_card} href={`talent/${slug}`}>
      <div className={styles.main_content}>
        <div className={styles.image}>
          <img className={styles.logo} src={logo} alt={name} />
        </div>
        <div className={styles.info}>
          <div className={styles.title}>{name}</div>
          <div className={styles.text}>{tagline}</div>
        </div>
      </div>
      {quote && (
        <div className={styles.quote}>
          <p>{quote}</p>
        </div>
      )}
    </a>
  );
}
