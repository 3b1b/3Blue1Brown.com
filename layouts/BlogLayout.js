import NormalLayout from "./NormalLayout";
import PageContent from "../components/PageContent";
import Disqus from "../components/Disqus";
import Jump from "../components/Jump";
import LessonVideo from "../components/LessonVideo";
import Section from "../components/Section";
import TableOfContents from "../components/TableOfContents";
import { formatDate } from "../util/locale";

// layout for lessons
const BlogLayout = ({ title, date, video }) => {
  return (
    <NormalLayout>
      <LessonVideo key={video} />
      <Section width="narrow">
        <h1 id="title" style={{ marginTop: 0 }}>
          {title}
        </h1>
        {date && <div style={{ fontStyle: "italic" }}>{formatDate(date)}</div>}
      </Section>
      <div />
      <PageContent />
      <Disqus />
      <TableOfContents />
      <Jump />
    </NormalLayout>
  );
};

export default BlogLayout;
