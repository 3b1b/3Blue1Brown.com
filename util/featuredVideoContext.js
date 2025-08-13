import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

const FeaturedVideoContext = createContext();

export const useFeaturedVideo = () => {
  const context = useContext(FeaturedVideoContext);
  if (!context) {
    throw new Error("useFeaturedVideo must be used within a FeaturedVideoProvider");
  }
  return context;
};

export const FeaturedVideoProvider = ({ children }) => {
  const [targetLesson, setTargetLesson] = useState(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  // Clear target lesson when navigating to homepage
  useEffect(() => {
    // Guard against router not being ready
    if (!router.events) return;

    const handleRouteChange = (url) => {
      // Clear target lesson when navigating to homepage (/ or index)
      if (url === '/' || url === '') {
        setTargetLesson(null);
      }
    };

    router.events.on('routeChangeComplete', handleRouteChange);
    
    // Also clear on initial load if we're on homepage
    if (router.pathname === '/') {
      setTargetLesson(null);
    }

    return () => {
      // Safely remove event listener
      if (router.events) {
        router.events.off('routeChangeComplete', handleRouteChange);
      }
    };
  }, [router.events, router.pathname]);

  const playLesson = (lesson) => {
    // Prevent rapid clicks during transition
    if (isTransitioning) {
      return;
    }

    // Validate lesson has required video property
    if (!lesson || !lesson.video || lesson.video.trim() === '') {
      console.warn('playLesson called with invalid lesson:', lesson);
      return;
    }

    setIsTransitioning(true);
    setTargetLesson(lesson);
    
    // Scroll to the featured video section with cleanup
    const timeoutId = setTimeout(() => {
      const featuredVideoElement = document.querySelector('[data-featured-video]');
      if (featuredVideoElement) {
        featuredVideoElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
      }
      // Clear transition state after scroll completes
      setTimeout(() => setIsTransitioning(false), 500);
    }, 100);

    // Store timeout ID for potential cleanup (though not used here, good practice)
    return () => clearTimeout(timeoutId);
  };

  const clearTargetLesson = () => {
    setTargetLesson(null);
  };

  return (
    <FeaturedVideoContext.Provider value={{
      targetLesson,
      isTransitioning,
      playLesson,
      clearTargetLesson,
    }}>
      {children}
    </FeaturedVideoContext.Provider>
  );
};

FeaturedVideoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};