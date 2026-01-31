import { useContext } from "react";
import PropTypes from "prop-types";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";

TalentCard.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default function TalentCard({ slug }) {
  const { talentMeta } = useContext(PageContext);

  const data = talentMeta?.find((t) => t.slug === slug);

  if (!data) {
    console.warn(`TalentCard: No data found for slug "${slug}"`);
    return null;
  }

  const { logo, name, tagline, featured_quote } = data;

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
      {featured_quote && (
        <div className={styles.quote}>
          <p>"{featured_quote}"</p>
        </div>
      )}
    </a>
  );
}
