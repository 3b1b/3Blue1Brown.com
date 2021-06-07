import LessonLayout from "../../layouts/lesson";
import { lessonPaths, lessonProps } from "../../util/pages";

export default LessonLayout;

export const getStaticPaths = async () => ({
  paths: await lessonPaths(),
  fallback: false,
});

export const getStaticProps = async ({ params }) =>
  await lessonProps(params.slug);
