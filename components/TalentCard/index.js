import PropTypes from "prop-types";
import { useContext } from "react";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";

TalentCard.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default function TalentCard({ slug }) {
  const { talentMeta } = useContext(PageContext);

  // Find company by slug
  const company = talentMeta?.find((c) => c.slug === slug);

  if (!company) {
    console.error(`Company not found: ${slug}`);
    return null;
  }

  return (
    <a className={styles.talent_card} href={`talent/${slug}`}>
      <div className={styles.image}>
        <img className={styles.banner} src={company.banner} alt="" />
        <div className={styles.vignette}></div>
        <img className={styles.logo} src={company.logo} alt="" />
      </div>
      <div className={styles.title}>{company.title}</div>
      <div className={styles.text}>{company.description}</div>
    </a>
  );
}
