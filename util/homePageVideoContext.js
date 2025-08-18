import { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";

const HomePageVideoContext = createContext();

export const useHomePageVideo = () => {
  const context = useContext(HomePageVideoContext);
  if (!context) {
    throw new Error("useHomePageVideo must be used within a HomePageVideoProvider");
  }
  return context;
};

export const HomePageVideoProvider = ({ children }) => {
  const [targetLesson, setTargetLesson] = useState(null);

  // playLesson is now primarily for programmatic use (e.g., homepage URL parameters)
  // Most navigation should use direct URL links
  const playLesson = (lesson) => {
    // Validate lesson has required video property
    if (!lesson || !lesson.video || lesson.video.trim() === '') {
      console.warn('playLesson called with invalid lesson:', lesson);
      return;
    }

    // Set target lesson for legacy compatibility
    setTargetLesson(lesson);
    
    // Only scroll if this was triggered by a LessonCard click (indicated by #video-section hash)
    setTimeout(() => {
      if (window.location.hash === '#video-section') {
        // Scroll to the video-section section with id="video-section"
        const videoSection = document.getElementById('video-section');
        if (videoSection) {
          videoSection.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'center' 
          });
        } else {
          // Fallback: scroll to top if section not found
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        // Remove the hash after scrolling
        window.history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    }, 100);
  };

  const clearTargetLesson = () => {
    setTargetLesson(null);
  };

  return (
    <HomePageVideoContext.Provider value={{
      targetLesson,
      playLesson,
      clearTargetLesson,
    }}>
      {children}
    </HomePageVideoContext.Provider>
  );
};

HomePageVideoProvider.propTypes = {
  children: PropTypes.node.isRequired,
};