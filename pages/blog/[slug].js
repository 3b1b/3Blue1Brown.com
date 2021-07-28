import BlogLayout from "../../layouts/BlogLayout";

import { blogPaths, blogProps } from "../../util/pages";

export default BlogLayout;

export async function getStaticPaths() {
  return {
    paths: blogPaths,
    fallback: false,
  };
}

export async function getStaticProps({ params }) {
  return await blogProps(params.slug);
}
