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

export const getServerSideProps = async ({ query }) => {
  try {
    // Get the base page props
    const baseProps = await pageProps("index");
    
    // Only process video-specific meta tags if we have a video query
    if (query.v && typeof query.v === 'string') {
      // Use the lessons data that should already be in baseProps
      const lessons = baseProps?.props?.lessons;
      
      if (Array.isArray(lessons)) {
        const lesson = lessons.find(l => l?.slug === query.v);
        
        if (lesson?.video) {
          // Override just the meta tag properties
          baseProps.props = {
            ...baseProps.props,
            title: lesson.title,
            description: lesson.description || 'Check out this math video from 3Blue1Brown',
            thumbnail: `https://img.youtube.com/vi/${lesson.video}/maxresdefault.jpg`,
            location: `https://www.3blue1brown.com/?v=${lesson.slug}`
          };
        }
      }
    }
    
    return baseProps;
  } catch (error) {
    // Log the error for debugging
    console.error('getServerSideProps error:', error.message);
    
    // If anything fails, fall back to static behavior
    try {
      return await pageProps("index");
    } catch (fallbackError) {
      // Last resort fallback
      return {
        props: {
          lessons: [],
          blogPosts: [],
          site: {}
        }
      };
    }
  }
};
