import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import NormalLayout from "../layouts/NormalLayout";
import { pageProps } from "../util/pages";
import { useHomePageVideo } from "../util/homePageVideoContext";
import { getVideoSlugFromQuery } from "../util/videoNavigation";
import Section from "../components/Section";
import SocialIcons from "../components/SocialIcons";
import HomePageVideo from "../components/HomePageVideo";
import LessonGallery from "../components/LessonGallery";
import SupportPitch from "../components/SupportPitch";

function HomePage(props) {
  const router = useRouter();
  const { playLesson } = useHomePageVideo();
  const { lessons = [], currentVideo } = props;
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
  }, [router.isReady, router.query, lessons, playLesson]);

  // Render homepage content directly without MDX to save ~100kB
  return (
    <>
      {/* Custom Head for video-specific meta tags */}
      {currentVideo && (
        <Head>
          <title>{currentVideo.title} - 3Blue1Brown</title>
          <meta name="title" content={`${currentVideo.title} - 3Blue1Brown`} />
          <meta name="description" content={currentVideo.description || 'Mathematics with a distinct visual perspective'} />
          
          {/* Open Graph tags */}
          <meta property="og:type" content="video.other" />
          <meta property="og:title" content={`${currentVideo.title} - 3Blue1Brown`} />
          <meta property="og:description" content={currentVideo.description || 'Mathematics with a distinct visual perspective'} />
          <meta property="og:image" content={currentVideo.thumbnail} />
          <meta property="og:url" content={`https://www.3blue1brown.com/?v=${currentVideo.slug}`} />
          <meta property="og:site_name" content="3Blue1Brown" />
          {currentVideo.video && <meta property="og:video" content={`https://www.youtube.com/watch?v=${currentVideo.video}`} />}
          <meta property="og:video:type" content="text/html" />
          <meta property="og:video:width" content="1280" />
          <meta property="og:video:height" content="720" />
          
          {/* Twitter Card tags */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={`${currentVideo.title} - 3Blue1Brown`} />
          <meta name="twitter:description" content={currentVideo.description || 'Mathematics with a distinct visual perspective'} />
          <meta name="twitter:image" content={currentVideo.thumbnail} />
          <meta name="twitter:url" content={`https://www.3blue1brown.com/?v=${currentVideo.slug}`} />
          <meta name="twitter:site" content="@3blue1brown" />
          <meta name="twitter:creator" content="@3blue1brown" />
          {currentVideo.video && <meta name="twitter:player" content={`https://www.youtube.com/watch?v=${currentVideo.video}`} />}
          <meta name="twitter:player:width" content="1280" />
          <meta name="twitter:player:height" content="720" />
          
          {/* Preload image for faster loading */}
          <link rel="preload" href={currentVideo.thumbnail} as="image" />
        </Head>
      )}
      
      <NormalLayout {...props}>
        <Section id="video-section" dark={true}>
          <SocialIcons />
          <HomePageVideo />
        </Section>
        
        <Section id="lessons" dark={true}>
          <LessonGallery show="topic"/>
        </Section>
        
        <Section width="narrow">
          <SupportPitch />
        </Section>
        
        <Section>
          <iframe 
            src="https://3blue1brown.substack.com/embed" 
            width="640" 
            height="180"
            style={{ border: 'none', maxWidth: '100%' }}
            title="3Blue1Brown Newsletter"
          />
        </Section>
      </NormalLayout>
    </>
  );
}

export default HomePage;

export const getServerSideProps = async (context) => {
  const { query } = context;
  
  // Get base props
  const { props } = await pageProps("index");
  
  // If there's a video parameter, modify props for social media crawlers
  if (query.v) {
    const targetLesson = props.lessons.find(lesson => lesson.slug === query.v);
    
    if (targetLesson && targetLesson.video && targetLesson.video.trim() !== '') {
      // Update props with video-specific metadata
      return {
        props: {
          ...props,
          // Override with video-specific metadata
          title: targetLesson.title,
          description: targetLesson.description || 'Mathematics with a distinct visual perspective',
          thumbnail: targetLesson.thumbnail,
          location: `https://www.3blue1brown.com/?v=${query.v}`,
          // Add video-specific data for meta tags
          currentVideo: targetLesson
        }
      };
    }
  }
  
  // For non-video URLs or invalid video slugs, return default props
  return { props };
};
