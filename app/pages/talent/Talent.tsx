import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import TriangleGrid from "~/components/TriangleGrid";
import Details from "./Contact";
import Intro from "./Intro";
import Gallery from "./Partners";
import PartnersHeader from "./PartnersHeader";

export default function Talent() {
  return (
    <>
      <Meta
        title="Talent"
        description="Organizations interested in hiring the kinds of technically curious people who watch 3Blue1Brown"
      />

      <Header
        background={
          <TriangleGrid className="mask-b-from-0% mask-b-to-100% opacity-65" />
        }
      >
        <PartnersHeader />
      </Header>

      <Main>
        <Intro />
        <Gallery />
        <Details />
      </Main>

      <Footer />
    </>
  );
}
