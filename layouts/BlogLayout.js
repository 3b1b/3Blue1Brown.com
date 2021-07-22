import NormalLayout from "./NormalLayout";
import PageContent from "../components/PageContent";
import Disqus from "../components/Disqus";
import Jump from "../components/Jump";
import Section from "../components/Section";
import Link from "next/link";

// layout for lessons
const BlogLayout = ({ title }) => {
  return (
    <NormalLayout>
      <div />
      <Section width="narrow">
        <h1 id="title">
          <Link href="/blog">Blog / </Link>
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
