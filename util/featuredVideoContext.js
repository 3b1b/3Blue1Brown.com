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
  const router = useRouter();

  const playLesson = (lesson) => {
    // Validate lesson has required video property
    if (!lesson || !lesson.video || lesson.video.trim() === '') {
      console.warn('playLesson called with invalid lesson:', lesson);
      return;
    }

    // Set target lesson for autoplay detection
    setTargetLesson(lesson);
    
    // Scroll to the featured video section
    setTimeout(() => {
      const featuredVideoElement = document.querySelector('[data-featured-video]');
      if (featuredVideoElement) {
        featuredVideoElement.scrollIntoView({ 
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
    <FeaturedVideoContext.Provider value={{
      targetLesson,
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