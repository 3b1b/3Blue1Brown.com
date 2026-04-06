import Footer from "~/components/Footer";
import BaseHeader from "~/components/Header";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import TriangleGrid from "~/components/TriangleGrid";
import Details from "./Contact";
import Header from "./Header";
import Intro from "./Intro";
import Gallery from "./Partners";

export default function Talent() {
  return (
    <>
      <Meta
        title="Talent"
        description="Organizations interested in hiring the kinds of technically curious people who watch 3Blue1Brown"
      />

      <BaseHeader
        background={
          <TriangleGrid className="mask-b-from-0% mask-b-to-100% opacity-65" />
        }
      >
        <Header />
      </BaseHeader>

      <Main>
        <Intro />
        <Gallery />
        <Details />
      </Main>

      <Footer />
    </>
  );
}
