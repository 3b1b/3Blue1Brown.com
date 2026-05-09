import { useAtomValue } from "jotai";
import Footer from "~/components/Footer";
import Grid from "~/components/Grid";
import Header from "~/components/Header";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import { getLesson } from "~/pages/lessons/lessons";
import { useEgg } from "~/util/hooks";
import Follow from "./Follow";
import Hero from "./Hero";
import Lessons, { lessonAtom } from "./Lessons";
import Patreon from "./Patreon";
import Talent from "./Talent";
import Theater from "./Theater";

// home page
export default function Home() {
  // page title, currently viewed lesson in theater
  const title = getLesson(useAtomValue(lessonAtom) ?? "")?.frontmatter.title;

  useEgg();

  return (
    <>
      <Meta title={title} />

      <Header
        background={
          <Grid className="max-h-200 mask-b-from-0% mask-b-to-100% opacity-50 transition-opacity duration-1000 playing:opacity-0" />
        }
      >
        <Theater />
      </Header>

      <Main>
        <Hero />
        <Lessons />
        <Patreon />
        <Talent />
        <Follow />
      </Main>

      <Footer />
    </>
  );
}
