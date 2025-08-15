import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import NormalLayout from "../layouts/NormalLayout";
import { pageProps } from "../util/pages";
import { useHomePageVideo } from "../util/homePageVideoContext";
import { getVideoSlugFromQuery } from "../util/videoNavigation";

function HomePage(props) {
  const router = useRouter();
  const { playLesson } = useHomePageVideo();
  const { lessons = [] } = props;
  const hasPlayedFromUrl = useRef(false);

  useEffect(() => {
    // Wait for router to be ready to avoid missing URL parameters
    if (!router.isReady) return;
    
    const videoSlug = getVideoSlugFromQuery(router.query);
    
    if (videoSlug && !hasPlayedFromUrl.current) {
      // Find the lesson with the matching slug
      const targetLesson = lessons.find(lesson => lesson.slug === videoSlug);
      
      if (targetLesson && targetLesson.video && targetLesson.video.trim() !== '') {
        // Auto-play the lesson
        playLesson(targetLesson);
        hasPlayedFromUrl.current = true;
      } else if (targetLesson) {
        console.warn(`Lesson "${videoSlug}" found but has no video`);
      } else {
        console.warn(`Lesson "${videoSlug}" not found`);
      }
    }
  }, [router.isReady, router.query.v, lessons, playLesson]);

  return <NormalLayout {...props} />;
}

export default HomePage;

// Use getServerSideProps instead of getStaticProps to access query parameters
export const getServerSideProps = async ({ query }) => {
  const props = await pageProps("index");
  
  // If there's a video query parameter, get the lesson data for meta tags
  if (query.v) {
    const lesson = props.props.lessons.find(l => l.slug === query.v);
    if (lesson && lesson.video) {
      // Override page meta tags with video-specific data
      props.props.title = lesson.title;
      props.props.description = lesson.description || 'Check out this math video from 3Blue1Brown';
      props.props.thumbnail = `https://img.youtube.com/vi/${lesson.video}/maxresdefault.jpg`;
      props.props.location = `https://www.3blue1brown.com/?v=${lesson.slug}`;
    }
  }
  
  return props;
};
