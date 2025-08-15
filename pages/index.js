import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import NormalLayout from "../layouts/NormalLayout";
import { pageProps } from "../util/pages";
import { useHomePageVideo } from "../util/homePageVideoContext";
import { getVideoSlugFromQuery } from "../util/videoNavigation";

function HomePage(props) {
  const router = useRouter();
  const { playLesson } = useHomePageVideo();
  const { lessons = [] } = props;
  const hasPlayedFromUrl = useRef(false);

  // Get current video for meta tags
  const videoSlug = router.isReady ? getVideoSlugFromQuery(router.query) : null;
  const currentLesson = videoSlug ? lessons.find(lesson => lesson.slug === videoSlug) : null;

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

  return (
    <>
      {/* Dynamic meta tags for video sharing - rendered after default Head */}
      {currentLesson && currentLesson.video && (
        <Head>
          <title>{currentLesson.title} | 3Blue1Brown</title>
          <meta name="title" content={`${currentLesson.title} | 3Blue1Brown`} />
          <meta name="description" content={currentLesson.description || 'Check out this math video from 3Blue1Brown'} />
          <meta property="og:title" content={`${currentLesson.title} | 3Blue1Brown`} />
          <meta property="og:description" content={currentLesson.description || 'Check out this math video from 3Blue1Brown'} />
          <meta property="og:image" content={`https://img.youtube.com/vi/${currentLesson.video}/maxresdefault.jpg`} />
          <meta property="og:url" content={`https://www.3blue1brown.com/?v=${currentLesson.slug}`} />
          <meta property="twitter:title" content={`${currentLesson.title} | 3Blue1Brown`} />
          <meta property="twitter:description" content={currentLesson.description || 'Check out this math video from 3Blue1Brown'} />
          <meta property="twitter:image" content={`https://img.youtube.com/vi/${currentLesson.video}/maxresdefault.jpg`} />
          <meta property="twitter:url" content={`https://www.3blue1brown.com/?v=${currentLesson.slug}`} />
        </Head>
      )}
      <NormalLayout {...props} />
    </>
  );
}

export default HomePage;

export const getStaticProps = async () => await pageProps("index");
