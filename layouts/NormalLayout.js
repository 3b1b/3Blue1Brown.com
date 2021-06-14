import Head from "../components/Head";
import Header from "../components/Header";
import Main from "../components/Main";
import Footer from "../components/Footer";
import PageContent from "../components/PageContent";
import Glow from "../components/Glow";
import Fade from "../components/Fade";

// default, normal layout
const Normal = ({ children }) => (
  <>
    <Head />
    <Header />
    <Main>
      {!children && <PageContent />}
      {children}
    </Main>
    <Footer />
    <Glow />
    <Fade />
  </>
);

export default Normal;
