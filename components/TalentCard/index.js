import { useContext } from "react";
import { PageContext } from "../../pages/_app";
import FeatureCard from "../FeatureCard";

const TalentCard = ({ slug, text, ...otherProps }) => {
  const { talentMeta } = useContext(PageContext);

  // Find company by slug
  const company = talentMeta?.find(c => c.slug === slug);

  if (!company) {
    console.error(`Company not found: ${slug}`);
    return null;
  }

  return (
    <FeatureCard
      link={`talent/${slug}`}
      background={company.banner}
      image={company.logo}
      title={company.title}
      text={text || company.description}
      height={150}
      id={slug}
      {...otherProps}
    />
  );
};

export default TalentCard;
