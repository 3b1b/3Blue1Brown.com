import NormalLayout from "./NormalLayout";
import PageContent from "../components/PageContent";
import Disqus from "../components/Disqus";
import Jump from "../components/Jump";
import Section from "../components/Section";
import { formatDate } from "../util/locale";

// layout for lessons
const BlogLayout = ({ title, date }) => {
  return (
    <NormalLayout>
      <Section width="narrow">
        {date && <div style={{ fontStyle: "italic" }}>{formatDate(date)}</div>}
        <h1 id="title" style={{ marginTop: 0 }}>
          {title}
        </h1>
      </Section>
      <div />
      <PageContent />
      <Disqus />
      <Jump />
    </NormalLayout>
  );
};

export default BlogLayout;
