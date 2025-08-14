import { useState } from "react";
import { useRouter } from "next/router";
import { useFeaturedVideo } from "../util/featuredVideoContext";
import { createVideoUrl, getVideoSlugFromQuery } from "../util/videoNavigation";

// Configuration constants
const NAVIGATION_TRANSITION_DURATION = 200; // ms - Time to allow content to stabilize after navigation

/**
 * Custom hook for FeaturedVideo navigation logic
 * Handles all video navigation state and actions
 */
export const useFeaturedVideoNavigation = (videosLessons) => {
  const router = useRouter();
  const { clearTargetLesson } = useFeaturedVideo();
  const [isNavigating, setIsNavigating] = useState(false);

  // Helper function for safe navigation with error handling
  const navigateToLesson = async (lesson, action = "navigate") => {
    // Prevent rapid navigation clicks
    if (isNavigating) {
      console.log(`Navigation blocked: already navigating (${action})`);
      return;
    }

    try {
      setIsNavigating(true);
      const url = createVideoUrl(lesson.slug);
      await router.replace(url);
      clearTargetLesson();
      
      // Brief delay to allow content to stabilize
      setTimeout(() => {
        setIsNavigating(false);
      }, NAVIGATION_TRANSITION_DURATION);
    } catch (error) {
      console.error(`Failed to ${action} to lesson ${lesson.slug}:`, error);
      setIsNavigating(false);
      // Could show user-facing error message here if needed
    }
  };

  // Determine current lesson from URL or fallback to latest
  const getCurrentLesson = () => {
    const videoSlug = getVideoSlugFromQuery(router.query);
    if (videoSlug) {
      const urlLesson = videosLessons.find(lesson => lesson.slug === videoSlug);
      if (urlLesson) return urlLesson;
    }
    // Fallback to latest video
    return videosLessons[videosLessons.length - 1];
  };

  const currentLesson = getCurrentLesson();
  const currentIndex = videosLessons.findIndex(lesson => lesson.slug === currentLesson.slug);
  const isLatest = currentIndex === videosLessons.length - 1;

  // Navigation functions
  const navigation = {
    goToPrevious: () => {
      if (currentIndex > 0) {
        const prevLesson = videosLessons[currentIndex - 1];
        navigateToLesson(prevLesson, "go to previous");
      }
    },
    
    goToNext: () => {
      if (currentIndex < videosLessons.length - 1) {
        const nextLesson = videosLessons[currentIndex + 1];
        navigateToLesson(nextLesson, "go to next");
      }
    },
    
    goToRandom: () => {
      let randomIndex;
      do {
        randomIndex = Math.floor(Math.random() * videosLessons.length);
      } while (randomIndex === currentIndex && videosLessons.length > 1);
      const randomLesson = videosLessons[randomIndex];
      navigateToLesson(randomLesson, "go to random");
    },
    
    goToFirst: () => {
      const firstLesson = videosLessons[0];
      navigateToLesson(firstLesson, "go to first");
    },
    
    goToLast: () => {
      const lastLesson = videosLessons[videosLessons.length - 1];
      navigateToLesson(lastLesson, "go to last");
    }
  };

  return {
    currentLesson,
    currentIndex,
    isLatest,
    isNavigating,
    navigation
  };
};