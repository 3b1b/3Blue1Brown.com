import { useEffect } from "react";
import { useRouter } from "next/router";
import NormalLayout from "../layouts/NormalLayout";
import { pageProps } from "../util/pages";
import { useFeaturedVideo } from "../util/featuredVideoContext";

function HomePage(props) {
  const router = useRouter();
  const { playLesson } = useFeaturedVideo();
  const { lessons = [] } = props;

  useEffect(() => {
    const { v } = router.query;
    
    if (v) {
      // Find the lesson with the matching slug
      const targetLesson = lessons.find(lesson => lesson.slug === v);
      
      if (targetLesson && targetLesson.video && targetLesson.video.trim() !== '') {
        // Auto-play the lesson
        playLesson(targetLesson);
      } else if (targetLesson) {
        console.warn(`Lesson "${v}" found but has no video`);
      } else {
        console.warn(`Lesson "${v}" not found`);
      }
    }
  }, [router.query, lessons, playLesson]);

  return <NormalLayout {...props} />;
}

export default HomePage;

export const getStaticProps = async () => await pageProps("index");
