import Head from "../components/Head";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import PageContent from "../components/PageContent";
import Anchors from "../components/Anchors";
import Glow from "../components/Glow";

// default, normal layout
const Normal = ({ children }) => (
  <>
    {/* hidden page meta data */}
    <Head />
    {/* top of page */}
    <Header />
    {/* singleton components */}
    <Anchors />
    <Glow />
    {/* main content of page */}
    <Main>
      {!children && <PageContent />}
      {children}
    </Main>
    {/* bottom of page */}
    <Footer />
  </>
);

export default Normal;
