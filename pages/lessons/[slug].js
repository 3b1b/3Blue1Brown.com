import LessonLayout from "../../layouts/LessonLayout";
import { lessonPaths, lessonProps } from "../../util/pages";

export default LessonLayout;

export const getStaticPaths = async () => ({
  paths: lessonPaths,
  fallback: false,
});

export const getStaticProps = async ({ params }) =>
  await lessonProps(params.slug);
