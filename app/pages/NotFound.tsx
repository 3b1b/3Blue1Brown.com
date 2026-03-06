import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { H1 } from "~/components/Heading";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import PiCreature from "~/components/PiCreature";
import StrokeType from "~/components/StrokeType";

// 404 not found page
export default function NotFound() {
  return (
    <>
      <Meta title="Not Found" />

      <Header />

      <Main>
        <section className="bg-theme/10">
          <H1>
            <StrokeType>Not Found</StrokeType>
          </H1>

          <PiCreature emotion="sad" />

          <p className="max-w-100 self-center">
            The page you are looking for does not exist or may have moved.
          </p>
        </section>
      </Main>

      <Footer />
    </>
  );
}
