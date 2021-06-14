import NormalLayout from "../layouts/NormalLayout";
import { pageProps } from "../util/pages";

export default NormalLayout;

export const getStaticProps = async () => await pageProps("index");
