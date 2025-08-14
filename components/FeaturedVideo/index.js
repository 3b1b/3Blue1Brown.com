import { useState, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import PropTypes from "prop-types";
import Link from "next/link";
import { PageContext } from "../../pages/_app";
import { useFeaturedVideo } from "../../util/featuredVideoContext";
import { HomepageFeaturedYouTube } from "../HomepageFeaturedContent";
import Tooltip from "../Tooltip";
import styles from "./index.module.scss";

FeaturedVideo.propTypes = {
  autoplay: PropTypes.bool,
};

export default function FeaturedVideo({ autoplay = false }) {
  const router = useRouter();
  const { lessons } = useContext(PageContext);
  const { targetLesson, clearTargetLesson } = useFeaturedVideo();
  
  // Filter lessons that have videos and sort by date (oldest first)
  const videosLessons = lessons
    .filter(lesson => lesson.video && lesson.video.trim() !== '')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  if (videosLessons.length === 0) {
    return <div>No videos available</div>;
  }
  
  // Determine current lesson from URL or fallback to latest
  const getCurrentLesson = () => {
    const { v } = router.query;
    if (v) {
      const urlLesson = videosLessons.find(lesson => lesson.slug === v);
      if (urlLesson) return urlLesson;
    }
    // Fallback to latest video
    return videosLessons[videosLessons.length - 1];
  };
  
  const currentLesson = getCurrentLesson();
  const currentIndex = videosLessons.findIndex(lesson => lesson.slug === currentLesson.slug);
  const isLatest = currentIndex === videosLessons.length - 1;
  
  // Only autoplay if explicitly requested via prop
  const shouldAutoplay = autoplay;
  
  // Navigation functions using router
  const goToPrevious = () => {
    if (currentIndex > 0) {
      const prevLesson = videosLessons[currentIndex - 1];
      router.replace(`/?v=${prevLesson.slug}`);
      clearTargetLesson();
    }
  };
  
  const goToNext = () => {
    if (currentIndex < videosLessons.length - 1) {
      const nextLesson = videosLessons[currentIndex + 1];
      router.replace(`/?v=${nextLesson.slug}`);
      clearTargetLesson();
    }
  };
  
  const goToRandom = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * videosLessons.length);
    } while (randomIndex === currentIndex && videosLessons.length > 1);
    const randomLesson = videosLessons[randomIndex];
    router.replace(`/?v=${randomLesson.slug}`);
    clearTargetLesson();
  };
  
  const goToFirst = () => {
    const firstLesson = videosLessons[0];
    router.replace(`/?v=${firstLesson.slug}`);
    clearTargetLesson();
  };
  
  const goToLast = () => {
    const lastLesson = videosLessons[videosLessons.length - 1];
    router.replace(`/?v=${lastLesson.slug}`);
    clearTargetLesson();
  };
  
  return (
    <div className={styles.container} data-featured-video>
      <VideoPlayer 
        lesson={currentLesson} 
        autoplay={shouldAutoplay} 
        userInitiated={!!targetLesson}
      />
      <VideoInfo lesson={currentLesson} isLatest={isLatest} />
      <VideoControls
        currentIndex={currentIndex}
        totalVideos={videosLessons.length}
        onFirst={goToFirst}
        onPrevious={goToPrevious}
        onRandom={goToRandom}
        onNext={goToNext}
        onLast={goToLast}
      />
    </div>
  );
}

// Video player component
const VideoPlayer = ({ lesson, autoplay = false, userInitiated = false }) => (
  <div className={styles.videoPlayer}>
    <HomepageFeaturedYouTube 
      key={lesson.video} // Force re-mount when video changes
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
      <Link href={`https://www.youtube.com/watch?v=${lesson.video}`}>
        {lesson.title}
      </Link>
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
  onLast 
}) => (
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
      className={styles.randomButton}
      onClick={onRandom}
    >
      <i className="fa-solid fa-dice"></i>
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
  </div>
);