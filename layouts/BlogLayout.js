import NormalLayout from "./NormalLayout";
import PageContent from "../components/PageContent";
import Disqus from "../components/Disqus";
import Jump from "../components/Jump";
import Section from "../components/Section";
import Link from "next/link";
import { formatDate } from "../util/locale";

// layout for lessons
const BlogLayout = ({ title, date }) => {
  return (
    <NormalLayout>
      <Section width="narrow">
        <div>
          <Link href="/blog">
            <a>
              <i className="fas fa-arrow-left" style={{ marginRight: 8 }} />
              Blog
            </a>
          </Link>
          {date && (
            <>
              <span style={{ margin: "0 16px", color: "#ccc" }}>&bull;</span>
              <span style={{ fontStyle: "italic" }}>{formatDate(date)}</span>
            </>
          )}
        </div>
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
