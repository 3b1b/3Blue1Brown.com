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
    
    // Scroll to the featured video section
    setTimeout(() => {
      const homePageVideoElement = document.querySelector('[data-homepage-video]');
      if (homePageVideoElement) {
        homePageVideoElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'center' 
        });
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