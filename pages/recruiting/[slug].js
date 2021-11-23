import RecruitingLayout from "../../layouts/RecruitingLayout";

import { recruitingPaths, recruitingProps } from "../../util/pages";

export default RecruitingLayout;

export async function getStaticPaths() {
  return {
    paths: recruitingPaths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return await recruitingProps(params.slug);
}
