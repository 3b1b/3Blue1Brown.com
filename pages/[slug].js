import NormalLayout from "../layouts/NormalLayout";
import { pagePaths, pageProps } from "../util/pages";

export default NormalLayout;

export const getStaticPaths = async () => ({
  paths: pagePaths,
  fallback: false,
});

export const getStaticProps = async ({ params }) =>
  await pageProps(params.slug);
