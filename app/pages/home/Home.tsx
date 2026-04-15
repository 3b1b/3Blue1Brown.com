import { useEffect } from "react";
import clsx from "clsx";
import { useAtomValue } from "jotai";
import { random } from "lodash-es";
import { celebrate } from "~/components/Celebrate";
import Footer from "~/components/Footer";
import Grid from "~/components/Grid";
import Header from "~/components/Header";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import { playingAtom } from "~/components/YouTube";
import { getLesson } from "~/pages/lessons/lessons";
import { sleep } from "~/util/misc";
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

  // pi day!
  useEffect(() => {
    (async () => {
      const today = new Date();
      if (!(today.getMonth() === 2 && today.getDate() === 14)) return;
      for (let bursts = 10; bursts > 0; bursts--) {
        celebrate(true);
        await sleep(random(200, 1000));
      }
    })();
  }, []);

  // is video playing
  const playing = useAtomValue(playingAtom);

  return (
    <>
      <Meta title={title} />

      <Header
        background={
          <Grid
            className={clsx(
              "max-h-200 mask-b-from-0% mask-b-to-100% transition",
              playing ? "opacity-0" : "opacity-50",
            )}
          />
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
