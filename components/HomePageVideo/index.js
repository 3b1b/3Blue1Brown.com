import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { PageContext } from "../../pages/_app";
import { useHomePageVideo } from "../../util/homePageVideoContext";
import { HomepageFeaturedYouTube } from "../HomepageFeaturedContent";
import { useHomePageVideoNavigation } from "../../hooks/useHomePageVideoNavigation";
import { createVideoUrl } from "../../util/videoNavigation";
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
    <div id="video" className={styles.container} data-homepage-video>
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
const VideoInfo = ({ lesson, isLatest }) => {
  const [shareState, setShareState] = useState({ type: null, success: false });

  // Unified copy to clipboard utility
  const copyToClipboard = async (text) => {
    if (!text || typeof text !== 'string') {
      console.error('Invalid text provided to copyToClipboard');
      return false;
    }

    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API failed, using legacy method:', err);
      // Legacy fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.select();
        const success = document.execCommand('copy');
        document.body.removeChild(textArea);
        return success;
      } catch (legacyErr) {
        console.error('All clipboard methods failed:', legacyErr);
        return false;
      }
    }
  };

  // Unified success feedback
  const showSuccess = (type) => {
    setShareState({ type, success: true });
    setTimeout(() => setShareState({ type: null, success: false }), 2000);
  };

  // Main share function with smart fallback
  const handleShare = async (forceClipboard = false) => {
    if (!lesson?.slug) {
      console.error('No lesson data available for sharing');
      return;
    }

    try {
      const videoUrl = `${window.location.origin}${createVideoUrl(lesson.slug)}`;
      
      // Try Web Share API first (unless forced to use clipboard)
      if (!forceClipboard && navigator.share) {
        const shareData = {
          title: lesson.title || 'Check out this video from 3Blue1Brown',
          url: videoUrl,
        };

        try {
          await navigator.share(shareData);
          // No visual feedback needed for native share - the system UI handles it
          return;
        } catch (error) {
          if (error.name === 'AbortError') {
            // User cancelled sharing - no action needed
            return;
          }
          // Other errors fall through to clipboard
          console.log('Web Share API failed, falling back to clipboard:', error);
        }
      }

      // Clipboard fallback
      const success = await copyToClipboard(videoUrl);
      if (success) {
        showSuccess(forceClipboard ? 'copy' : 'share');
      } else {
        console.error('Failed to copy URL to clipboard');
      }
    } catch (error) {
      console.error('Error in handleShare:', error);
    }
  };

  // Direct copy function for copy button
  const handleCopyLink = () => handleShare(true);

  return (
    <div className={styles.videoInfo}>
      <div className={styles.videoMetadata}>
        {/* Left section: Share and Copy buttons */}
        <div className={styles.leftSection}>
          <Tooltip content={
            shareState.success && shareState.type === 'share' 
              ? "URL copied!" 
              : "Share video"
          }>
            <button 
              className={`${styles.shareButton} ${
                shareState.success && shareState.type === 'share' ? styles.copied : ''
              }`}
              onClick={() => handleShare(false)}
            >
              <i className={
                shareState.success && shareState.type === 'share' 
                  ? "fas fa-check" 
                  : "fas fa-arrow-up-from-bracket"
              }></i>
            </button>
          </Tooltip>
          <Tooltip content={
            shareState.success && shareState.type === 'copy' 
              ? "Link copied!" 
              : "Copy link"
          }>
            <button 
              className={`${styles.copyButton} ${
                shareState.success && shareState.type === 'copy' ? styles.copied : ''
              }`}
              onClick={handleCopyLink}
            >
              <i className={
                shareState.success && shareState.type === 'copy' 
                  ? "fas fa-check" 
                  : "fas fa-link"
              }></i>
            </button>
          </Tooltip>
        </div>
        
        {/* Center section: Date */}
        <div className={styles.centerSection}>
          <span className={styles.dateLabel}>
            {isLatest ? 'Latest video' : new Date(lesson.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        
        {/* Right section: Read button */}
        <div className={styles.rightSection}>
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
      </div>
      <div className={styles.videoTitle}>
        {lesson.title}
      </div>
    </div>
  );
};

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

  // Generate 5 random titles for the slot machine effect
  const generateRandomTitles = () => {
    const titles = [];
    for (let i = 0; i < 5; i++) {
      const randomIndex = Math.floor(Math.random() * videosLessons.length);
      titles.push(videosLessons[randomIndex].title);
    }
    return titles;
  };

  const handleRandomClick = () => {
    if (isAnimating) return; // Prevent multiple animations
    
    setIsAnimating(true);
    
    // Start navigation immediately for instant switching
    onRandom();
    
    // Run slot machine animation in parallel for visual effect
    const randomTitles = generateRandomTitles();
    let titleIndex = 0;

    // Get the title element to animate
    const titleElement = document.querySelector(`[data-homepage-video] .${styles.videoTitle}`);

    // Flash through titles quickly while new page loads
    const interval = setInterval(() => {
      if (titleElement) {
        titleElement.textContent = randomTitles[titleIndex];
      }
      titleIndex++;
      
      if (titleIndex >= randomTitles.length) {
        clearInterval(interval);
        // Animation complete - the new video should be loaded by now
        setTimeout(() => {
          setIsAnimating(false);
        }, 50);
      }
    }, 40); // 40ms per title = ~200ms total animation
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