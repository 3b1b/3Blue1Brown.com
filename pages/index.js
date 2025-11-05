import { useEffect, useRef } from "react";
import { useRouter } from "next/router";
import NormalLayout from "../layouts/NormalLayout";
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

export const getServerSideProps = async (context) => {
  // Import server-side only modules inside getServerSideProps
  const { lessonMetaLight } = await import("../util/pages");
  const siteModule = await import("../data/site.yaml");
  // Extract the actual data from the module (it's the default export)
  const site = siteModule.default || siteModule;

  const videoSlug = context.query.v;

  // Start with default homepage props (use precomputed data to avoid file system operations)
  const props = {
    title: site.title,
    description: site.description,
    thumbnail: site.thumbnail || "/favicons/share-thumbnail.jpg",
    lessons: lessonMetaLight,
    blogPosts: [],
    site: site,
  };

  // If there's a ?v= parameter, customize the title, description, and thumbnail for social sharing
  if (videoSlug) {
    const lesson = lessonMetaLight.find(l => l.slug === videoSlug);
    if (lesson && lesson.video) {
      props.title = lesson.title;
      props.description = lesson.description || props.description;
      props.thumbnail = `https://img.youtube.com/vi/${lesson.video}/maxresdefault.jpg`;
    }
  }

  return { props };
};
