import NormalLayout from "../../layouts/NormalLayout";

import { recruitmentPaths, recruitmentProps } from "../../util/pages";

export default NormalLayout;

export async function getStaticPaths() {
  return {
    paths: recruitmentPaths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return await recruitmentProps(params.slug);
}
