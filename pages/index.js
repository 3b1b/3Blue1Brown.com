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
  try {
    const result = await pageProps("index");
    
    // Ensure we have valid props structure
    if (!result?.props) {
      console.error('Invalid pageProps result structure');
      return result;
    }
    
    // If there's a video query parameter, get the lesson data for meta tags
    if (query.v && typeof query.v === 'string') {
      const lessons = result.props.lessons;
      
      // Validate lessons array exists
      if (!Array.isArray(lessons)) {
        console.warn('No lessons array found in pageProps');
        return result;
      }
      
      const lesson = lessons.find(l => l?.slug === query.v);
      
      if (lesson?.video && typeof lesson.video === 'string' && lesson.video.trim()) {
        // Override page meta tags with video-specific data
        result.props.title = lesson.title || 'Untitled Video';
        result.props.description = lesson.description || 'Check out this math video from 3Blue1Brown';
        result.props.thumbnail = `https://img.youtube.com/vi/${lesson.video}/maxresdefault.jpg`;
        
        // Use site config for base URL, fallback to hardcoded
        const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.3blue1brown.com';
        result.props.location = `${baseUrl}/?v=${lesson.slug}`;
      } else if (lesson) {
        console.warn(`Lesson "${query.v}" found but has no valid video ID`);
      } else {
        console.warn(`Lesson "${query.v}" not found`);
      }
    }
    
    return result;
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    // Return basic props as fallback
    return { props: { lessons: [], blogPosts: [], site: {} } };
  }
};
