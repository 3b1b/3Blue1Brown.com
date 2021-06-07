import NormalLayout from "../layouts/normal";
import { pageProps } from "../util/pages";

export default NormalLayout;

export const getStaticProps = async () => await pageProps("index");
