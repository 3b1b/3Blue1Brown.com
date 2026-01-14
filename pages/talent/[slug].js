import TalentLayout from "../../layouts/TalentLayout";
import { talentPaths, talentProps } from "../../util/pages";

export default TalentLayout;

export async function getStaticPaths() {
  return {
    paths: talentPaths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return await talentProps(params.slug);
}
