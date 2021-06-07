import NormalLayout from "../layouts/normal";
import { pagePaths, pageProps } from "../util/pages";

export default NormalLayout;

export const getStaticPaths = async () => ({
  paths: await pagePaths(),
  fallback: false,
});

export const getStaticProps = async ({ params }) =>
  await pageProps(params.slug);
