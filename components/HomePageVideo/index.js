import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { PageContext } from "../../pages/_app";
import { useHomePageVideo } from "../../util/homePageVideoContext";
import { HomepageFeaturedYouTube } from "../HomepageFeaturedContent";
import { useHomePageVideoNavigation } from "../../hooks/useHomePageVideoNavigation";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

HomePageVideo.propTypes = {
  autoplay: PropTypes.bool,
};

export default function HomePageVideo({ autoplay = false }) {
  const { lessons } = useContext(PageContext);
  const { targetLesson } = useHomePageVideo();
  
  // Filter lessons that have videos and sort by date (oldest first)
  const videosLessons = lessons
    .filter(lesson => lesson.video && lesson.video.trim() !== '')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  // Use the custom hook for navigation logic (must be called before any early returns)
  const { 
    currentLesson, 
    currentIndex, 
    isLatest, 
    isNavigating,
    navigation 
  } = useHomePageVideoNavigation(videosLessons);
  
  if (videosLessons.length === 0) {
    return <div>No videos available</div>;
  }
  
  return (
    <div className={styles.container} data-homepage-video>
      <div className={`${styles.content} ${isNavigating ? styles.navigating : ''}`}>
        <VideoPlayer 
          lesson={currentLesson} 
          autoplay={autoplay} 
          userInitiated={!!targetLesson}
        />
        <VideoInfo lesson={currentLesson} isLatest={isLatest} />
        <VideoControls
          currentIndex={currentIndex}
          totalVideos={videosLessons.length}
          onFirst={navigation.goToFirst}
          onPrevious={navigation.goToPrevious}
          onRandom={navigation.goToRandom}
          onNext={navigation.goToNext}
          onLast={navigation.goToLast}
          videosLessons={videosLessons}
        />
      </div>
      {isNavigating && (
        <div 
          className={styles.loadingOverlay} 
          role="status" 
          aria-live="polite"
          aria-label="Loading new video"
        >
          <div className={styles.spinner} aria-hidden="true"></div>
          <span className={styles.srOnly}>Loading new video...</span>
        </div>
      )}
    </div>
  );
}

// Video player component
const VideoPlayer = ({ lesson, autoplay = false, userInitiated = false }) => (
  <div className={styles.videoPlayer}>
    <HomepageFeaturedYouTube 
      slug={lesson.video} 
      autoplay={autoplay} 
      userInitiated={userInitiated}
    />
  </div>
);

// Video info component (date, title, written version indicator)
const VideoInfo = ({ lesson, isLatest }) => (
  <div className={styles.videoInfo}>
    <div className={styles.latestVideoLabel}>
      <span>
        {isLatest ? 'Latest video' : new Date(lesson.date).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}
      </span>
      {!lesson.empty && (
        <Tooltip content="Read the text version">
          <Link href={`/lessons/${lesson.slug}#title`} className={styles.writtenVersionLink}>
            <button className={styles.writtenVersionButton}>
              <i className="far fa-newspaper"></i>
            </button>
          </Link>
        </Tooltip>
      )}
    </div>
    <div className={styles.videoTitle}>
      {lesson.title}
    </div>
  </div>
);

// Video navigation controls component
const VideoControls = ({ 
  currentIndex, 
  totalVideos, 
  onFirst, 
  onPrevious, 
  onRandom, 
  onNext, 
  onLast,
  videosLessons 
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  // Generate 10 random titles for the slot machine effect
  const generateRandomTitles = () => {
    const titles = [];
    for (let i = 0; i < 10; i++) {
      const randomIndex = Math.floor(Math.random() * videosLessons.length);
      titles.push(videosLessons[randomIndex].title);
    }
    return titles;
  };

  const handleRandomClick = () => {
    if (isAnimating) return; // Prevent multiple animations
    
    setIsAnimating(true);
    const randomTitles = generateRandomTitles();
    let titleIndex = 0;

    // Get the title element to animate
    const titleElement = document.querySelector(`[data-homepage-video] .${styles.videoTitle}`);

    // Flash through titles quickly
    const interval = setInterval(() => {
      if (titleElement) {
        titleElement.textContent = randomTitles[titleIndex];
      }
      titleIndex++;
      
      if (titleIndex >= randomTitles.length) {
        clearInterval(interval);
        // After animation completes, trigger the actual random navigation
        setTimeout(() => {
          setIsAnimating(false);
          onRandom();
        }, 50);
      }
    }, 40); // 40ms per title = ~400ms total animation
  };

  return (
    <div className={styles.videoControls}>
      <button
        className={styles.arrowFirst}
        aria-label="First video"
        onClick={onFirst}
        disabled={currentIndex === 0}
      >
        <i className="fas fa-step-backward" />
      </button>
      
      <button
        className={styles.arrowLeft}
        aria-label="Previous video"
        onClick={onPrevious}
        disabled={currentIndex === 0}
      >
        <i className="fas fa-angle-left" />
      </button>
      
      <button
        className={styles.arrowRight}
        aria-label="Next video"
        onClick={onNext}
        disabled={currentIndex === totalVideos - 1}
      >
        <i className="fas fa-angle-right" />
      </button>
      
      <button
        className={styles.arrowLast}
        aria-label="Last video"
        onClick={onLast}
        disabled={currentIndex === totalVideos - 1}
      >
        <i className="fas fa-step-forward" />
      </button>
      
      <button 
        className={`${styles.randomButton} ${isAnimating ? styles.animating : ''}`}
        onClick={handleRandomClick}
        title="Show random video"
        disabled={isAnimating}
      >
        <i className="fa-solid fa-dice"></i>
      </button>
    </div>
  );
};