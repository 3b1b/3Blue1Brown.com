import { useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import Link from "next/link";
import { useRouter } from "next/router";
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
  const router = useRouter();
  const { lessons } = useContext(PageContext);
  const { targetLesson } = useHomePageVideo();
  const [isClient, setIsClient] = useState(false);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  
  // Ensure we're on the client side to avoid hydration mismatch
  useEffect(() => {
    setIsClient(true);
    
    // Load description preference from sessionStorage, or use responsive default
    const savedPreference = sessionStorage.getItem('homepage-description-expanded');
    if (savedPreference !== null) {
      // User has a saved preference, use it
      setIsDescriptionExpanded(savedPreference === 'true');
    } else {
      // No saved preference, use responsive default
      const isWideScreen = window.innerWidth >= 768; // Same breakpoint as mobile styles
      setIsDescriptionExpanded(isWideScreen);
      // Save the default so it persists
      sessionStorage.setItem('homepage-description-expanded', isWideScreen.toString());
    }
  }, []);

  // Handle window resize to update defaults for users who haven't manually set preference
  useEffect(() => {
    const handleResize = () => {
      const userHasSetPreference = sessionStorage.getItem('homepage-description-user-set') === 'true';
      if (!userHasSetPreference) {
        const isWideScreen = window.innerWidth >= 768;
        setIsDescriptionExpanded(isWideScreen);
        sessionStorage.setItem('homepage-description-expanded', isWideScreen.toString());
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Save description preference to sessionStorage when it changes
  const handleDescriptionToggle = (expanded) => {
    setIsDescriptionExpanded(expanded);
    sessionStorage.setItem('homepage-description-expanded', expanded.toString());
    // Mark that user has manually set a preference
    sessionStorage.setItem('homepage-description-user-set', 'true');
  };
  
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
  
  // Don't render until we're on the client and router is ready
  if (!isClient || !router.isReady) {
    return (
      <div id="video-section" className={styles.container} data-homepage-video>
        <div className={styles.content}>
          <div className={styles.loadingState}>Loading...</div>
        </div>
      </div>
    );
  }
  
  if (videosLessons.length === 0) {
    return <div>No videos available</div>;
  }
  
  return (
    <div id="video-section" className={styles.container} data-homepage-video>
      <div className={`${styles.content} ${isNavigating ? styles.navigating : ''}`}>
        <VideoPlayer 
          lesson={currentLesson} 
          autoplay={autoplay} 
          userInitiated={!!targetLesson}
        />
        <VideoInfo 
          lesson={currentLesson} 
          isLatest={isLatest}
          isDescriptionExpanded={isDescriptionExpanded}
          setIsDescriptionExpanded={handleDescriptionToggle}
        />
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
const VideoInfo = ({ lesson, isLatest, isDescriptionExpanded, setIsDescriptionExpanded }) => {
  const [shareState, setShareState] = useState({ type: null, success: false });

  // Unified copy to clipboard utility
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (err) {
      console.error('Clipboard API failed, using legacy method:', err);
      // Legacy fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = text;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        return true;
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
    const videoUrl = `${window.location.origin}${createVideoUrl(lesson.slug)}`;
    
    // Try Web Share API first (unless forced to use clipboard)
    if (!forceClipboard && navigator.share) {
      const shareData = {
        title: lesson.title,
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
    }
  };


  return (
    <div className={styles.videoInfo}>
      <div className={styles.videoMetadata}>
        {/* Left section: Share button */}
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
        {lesson.description && (
          <button 
            className={styles.descriptionToggle}
            onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
            aria-expanded={isDescriptionExpanded}
            aria-label={isDescriptionExpanded ? "Hide description" : "Show description"}
          >
            <i className={`fas fa-chevron-${isDescriptionExpanded ? 'up' : 'down'}`}></i>
          </button>
        )}
      </div>
      {lesson.description && isDescriptionExpanded && (
        <div className={styles.videoDescription}>
          {lesson.description}
        </div>
      )}
    </div>
  );
};

VideoInfo.propTypes = {
  lesson: PropTypes.object.isRequired,
  isLatest: PropTypes.bool.isRequired,
  isDescriptionExpanded: PropTypes.bool.isRequired,
  setIsDescriptionExpanded: PropTypes.func.isRequired,
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

  const handleRandomClick = () => {
    if (isAnimating) return; // Prevent multiple clicks
    
    setIsAnimating(true);
    
    // Simply navigate to random lesson
    onRandom();
    
    // Reset animation state after a brief delay
    setTimeout(() => {
      setIsAnimating(false);
    }, 300); // Match the dice rotation animation duration
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