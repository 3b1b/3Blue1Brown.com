import { useAtomValue } from "jotai";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import { getLesson } from "~/data/lessons";
import { Meta } from "~/Meta";
import Explore, { lessonAtom } from "~/pages/home/Explore";
import Extras from "~/pages/home/Extras";
import Follow from "~/pages/home/Follow";
import Patreon from "~/pages/home/Patreon";
import Talent from "~/pages/home/Talent";
import Theater from "~/pages/home/Theater";

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
        <Talent />
        <Follow />
        <Extras />
      </main>

      <Footer />
    </>
  );
}
