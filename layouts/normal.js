import { MDXRemote } from "next-mdx-remote";
import Head from "../components/head";
import Header from "../components/header";
import Main from "../components/main";
import Footer from "../components/footer";
import PageContent from "../components/page-content";

const Normal = (props) => (
  <>
    <Head {...props} />
    <Header {...props} />
    <Main>
      {!props.children && <PageContent {...props} />}
      {props.children}
    </Main>
    <Footer {...props} />
  </>
);

export default Normal;
