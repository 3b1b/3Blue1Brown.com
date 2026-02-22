import Footer from "~/components/Footer";
import Meta from "~/components/Meta";
import Details from "./Contact";
import Gallery from "./Gallery";
import Header from "./Header";
import Intro from "./Intro";

export default function Talent() {
  return (
    <>
      <Meta
        title="Talent"
        description="Organizations interested in hiring the kinds of technically curious people who watch 3Blue1Brown"
      />

      <Header />

      <main id="content">
        <Intro />
        <Gallery />
        <Details />
      </main>

      <Footer />
    </>
  );
}
