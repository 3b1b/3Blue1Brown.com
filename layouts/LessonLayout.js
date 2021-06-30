import { useContext } from "react";
import Link from "next/link";
import NormalLayout from "./NormalLayout";
import PageContent from "../components/PageContent";
import Section from "../components/Section";
import LessonVideo from "../components/LessonVideo";
import LessonDetails from "../components/LessonDetails";
import Patrons from "../components/Patrons";
import Empty from "../components/Empty";
import LessonNav from "../components/LessonNav";
import Disqus from "../components/Disqus";
import Jump from "../components/Jump";
import TableOfContents from "../components/TableOfContents";
import { PageContext } from "../pages/_app";

// layout for lessons
const LessonLayout = () => {
  const { empty, video } = useContext(PageContext);
  return (
    <NormalLayout>
      {/* Key prevents state from being preserved when moving between pages: */}
      <LessonVideo key={video} />
      <LessonDetails />

      {/* Don't alternate section color after <LessonDetails> */}
      <div />

      {!empty && (
        <>
          <PageContent />
          <LessonNav />
          <License />
          <Thanks />
          <Disqus />
          <TableOfContents />
          <Jump />
        </>
      )}

      {empty && (
        <>
          <Empty />
          <Thanks />
        </>
      )}
    </NormalLayout>
  );
};

const License = () => (
  <Section>
    <h1 id="license">License</h1>
    <p className="center">
      All rights reserved. To use or reference in other media, reach out via the{" "}
      <Link href="/contact">
        <a>contact page</a>
      </Link>
      .
    </p>
  </Section>
);

const Thanks = () => {
  const { patrons = [] } = useContext(PageContext);
  return (
    <>
      {patrons.length > 0 && (
        <Section>
          <h1 id="thanks">Thanks</h1>
          <p>
            Special thanks to those below for supporting the original video
            behind this post, and to{" "}
            <Link href="/thanks">
              <a>current patrons</a>
            </Link>{" "}
            for funding ongoing projects. If you find these lessons valuable,{" "}
            <Link href="https://www.patreon.com/3blue1brown">
              <a>consider joining</a>
            </Link>
            .
          </p>
          <Patrons />
        </Section>
      )}
    </>
  );
};

export default LessonLayout;
