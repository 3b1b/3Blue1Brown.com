import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import NormalLayout from "../layouts/NormalLayout";
import { pageProps } from "../util/pages";
import { useHomePageVideo } from "../util/homePageVideoContext";
import { getVideoSlugFromQuery } from "../util/videoNavigation";
import Section from "../components/Section";
import SocialIcons from "../components/SocialIcons";
import HomePageVideo from "../components/HomePageVideo";
import LessonGallery from "../components/LessonGallery";
import SupportPitch from "../components/SupportPitch";
import Teaser from "../components/Teaser";

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

  // Render homepage content directly without MDX to save ~100kB
  return (
    <NormalLayout {...props}>
      <Section id="video-section" dark={true}>
        <SocialIcons />
        <HomePageVideo />
        <Teaser
          title="Math's most influential book"
          link="https://www.patreon.com/posts/is-euclids-137473211"
        />
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
  );
}

export default HomePage;

export const getStaticProps = async () => await pageProps("index");
