import Link from "next/link";
import NormalLayout from "./normal";
import Head from "../components/head";
import Header from "../components/header";
import Main from "../components/main";
import Footer from "../components/footer";
import PageContent from "../components/page-content";
import Section from "../components/section";
import Video from "../components/video";
import LessonDetails from "../components/lesson-details";
import Patrons from "../components/patrons";
import Clickable from "../components/clickable";
import ComingSoon from "../components/coming-soon";
import Disqus from "../components/disqus";

const Lesson = (props) => (
  <NormalLayout>
    <Section dark={true}>
      <Video id={props.video} />
    </Section>

    <LessonDetails {...props} />
    {/* lesson nav */}

    {props.content.trim() && (
      <>
        <Section>
          <PageContent {...props} />
        </Section>
        {/* lesson nav */}
        <License />
        <Thanks {...props} />
        <Disqus {...props} />
      </>
    )}

    {!props.content.trim() && (
      <>
        <ComingSoon />
        <Thanks {...props} />
      </>
    )}
  </NormalLayout>
);

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

const Thanks = ({ patrons = [] }) => (
  <>
    {patrons.length > 0 && (
      <Section>
        <h1 id="thanks">Thanks</h1>
        <p>
          These lessons are funded primarily by viewers and readers who join as
          contributing members on Patreon. To learn about this model, membership
          benefits, future projects, and more (or if you just want to find the
          secret video and other Easter eggs) visit the page below.
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

export default Lesson;
