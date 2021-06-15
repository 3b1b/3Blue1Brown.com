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
            These lessons are funded primarily by viewers and readers who join
            as contributing members on Patreon. To learn about this model,
            membership benefits, future projects, and more (or if you just want
            to find the secret video and other Easter eggs) visit the page
            below.
          </p>
          <Clickable
            link="https://www.patreon.com/3blue1brown"
            text="3Blue1Brown Patreon"
            icon="fab fa-patreon"
          />
          <p>
            Special thanks to the individuals below for their support of the
            original video behind this post, and further thanks to{" "}
            <Link href="/thanks">
              <a>current patrons</a>
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
