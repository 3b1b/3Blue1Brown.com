import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import TriangleGrid from "~/components/TriangleGrid";
import Gallery from "./Gallery";
import Questions from "./Questions";
import share from "./share.jpg";
import TalentHeader from "./TalentHeader";

export default function Talent() {
  return (
    <>
      <Meta
        title="Talent"
        description="Organizations interested in hiring the kinds of technically curious people who watch 3Blue1Brown"
        image={share}
      />

      <Header
        background={<TriangleGrid className="mask-b-from-0% mask-b-to-100%" />}
      >
        <TalentHeader />
      </Header>

      <Main>
        <Gallery />
        <Questions />
      </Main>

      <Footer />
    </>
  );
}
