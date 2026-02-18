import { useAtomValue } from "jotai";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Meta from "~/components/Meta";
import { getLesson } from "~/data/lessons";
import Explore, { lessonAtom } from "./Explore";
import Extras from "./Extras";
import Follow from "./Follow";
import Patreon from "./Patreon";
import Talent from "./Talent";
import Theater from "./Theater";

export default function Home() {
  // page title
  const title = getLesson(useAtomValue(lessonAtom)).lesson?.title;

  return (
    <>
      <Meta title={title} />

      <Header>
        <Theater />
      </Header>

      <main>
        <Explore />
        <Patreon />
        <Follow />
        <Talent />
        <Extras />
      </main>

      <Footer />
    </>
  );
}
