import { useEffect } from "react";
import { useAtomValue } from "jotai";
import { random } from "lodash-es";
import Footer from "~/components/Footer";
import Header from "~/components/Header";
import Main from "~/components/Main";
import Meta from "~/components/Meta";
import { getLesson } from "~/pages/lessons/lessons";
import { celebrate } from "~/util/dom";
import { sleep } from "~/util/misc";
import Explore, { lessonAtom } from "./Explore";
import Follow from "./Follow";
import Patreon from "./Patreon";
import Talent from "./Talent";
import Theater from "./Theater";

export default function Home() {
  // page title
  const title = getLesson(useAtomValue(lessonAtom) ?? "")?.frontmatter.title;

  // pi day!
  useEffect(() => {
    (async () => {
      const today = new Date();
      if (!(today.getMonth() === 2 && today.getDate() === 14)) return;
      for (let bursts = 5; bursts > 0; bursts--) {
        celebrate(random(true), random(true));
        await sleep(random(200, 1000));
      }
    })();
  }, []);

  return (
    <>
      <Meta title={title} />

      <Header>
        <Theater />
      </Header>

      <Main>
        <Explore />
        <Patreon />
        <Talent />
        <Follow />
      </Main>

      <Footer />
    </>
  );
}
