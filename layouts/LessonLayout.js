import { useContext } from "react";
import Link from "next/link";
import NormalLayout from "./NormalLayout";
import PageContent from "../components/PageContent";
import Section from "../components/Section";
import Video from "../components/Video";
import LessonDetails from "../components/LessonDetails";
import Patrons from "../components/Patrons";
import Clickable from "../components/Clickable";
import Empty from "../components/Empty";
import LessonNav from "../components/LessonNav";
import Disqus from "../components/Disqus";
import TableOfContents from "../components/TableOfContents";
import { PageContext } from "../pages/_app";

// layout for lessons
const LessonLayout = () => {
  const { video, empty } = useContext(PageContext);
  return (
    <NormalLayout>
      <Section dark={true}>
        <Video id={video} />
      </Section>

      <LessonDetails />
      <LessonNav />

      {!empty && (
        <>
          <PageContent />
          <LessonNav />
          <License />
          <Thanks />
          <Disqus />
        </>
      )}

      {empty && (
        <>
          <Empty />
          <Thanks />
        </>
      )}

      <TableOfContents />
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
            Special thanks to those below for supporting the
            original video behind this post, and to{" "}
            <Link href="/thanks">
              <a>current patrons</a>
            </Link>
            {" "}for funding ongoing projects.
            If you find these lessons valuable,{" "}
            <Link href="https://www.patreon.com/3blue1brown">
              <a>consider joining</a>
            </Link>
            .
          </p>
          <Patrons pagePatrons={patrons} />
        </Section>
      )}
    </>
  );
};

export default LessonLayout;
