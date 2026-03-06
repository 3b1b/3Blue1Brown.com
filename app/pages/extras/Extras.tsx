import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { H1 } from "~/components/Heading";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import StrokeType from "~/components/StrokeType";
import Blog from "~/pages/extras/Blog";
import Other from "~/pages/extras/Other";
import Podcast from "~/pages/extras/Podcast";

export default function Extras() {
  return (
    <>
      <Meta title="Extras" />

      <Header />

      <Main>
        <section className="bg-theme/10">
          <H1>
            <StrokeType>Extras</StrokeType>
          </H1>
        </section>

        <Other />
        <Podcast />
        <Blog />
      </Main>

      <Footer />
    </>
  );
}
