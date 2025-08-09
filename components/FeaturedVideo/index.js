import { useState, useContext } from "react";
import Link from "next/link";
import { PageContext } from "../../pages/_app";
import { HomepageFeaturedYouTube } from "../HomepageFeaturedContent";
import styles from "./index.module.scss";

export default function FeaturedVideo() {
  const { lessons } = useContext(PageContext);
  
  // Filter lessons that have videos and sort by date (oldest first)
  const videosLessons = lessons
    .filter(lesson => lesson.video && lesson.video.trim() !== '')
    .sort((a, b) => new Date(a.date) - new Date(b.date));
  
  const [currentIndex, setCurrentIndex] = useState(Math.max(0, videosLessons.length - 1));
  
  if (videosLessons.length === 0) {
    return <div>No videos available</div>;
  }
  
  const currentLesson = videosLessons[currentIndex];
  
  const goToPrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };
  
  const goToNext = () => {
    if (currentIndex < videosLessons.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  
  const goToRandom = () => {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * videosLessons.length);
    } while (randomIndex === currentIndex && videosLessons.length > 1);
    setCurrentIndex(randomIndex);
  };
  
  const isLatest = currentIndex === videosLessons.length - 1;
  
  return (
    <div className={styles.container}>
      
      <div className={styles.videoPlayer}>
        <HomepageFeaturedYouTube slug={currentLesson.video} />
      </div>
      
      <div className={styles.videoInfo}>
        <div className={styles.latestVideoLabel}>
          {isLatest ? 'Latest video' : new Date(currentLesson.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          })}
        </div>
        <div className={styles.videoTitle}>
          <Link href={`https://www.youtube.com/watch?v=${currentLesson.video}`}>
            {currentLesson.title}
          </Link>
        </div>
      </div>

      <div className={styles.videoControls}>
        <button
          className={styles.arrowLeft}
          aria-label="Previous video"
          onClick={goToPrevious}
          disabled={currentIndex === 0}
        >
          <i className="fas fa-angle-left" />
        </button>
        
        <button 
          className={styles.randomButton}
          onClick={goToRandom}
          title="Random video"
        >
          Random
        </button>
        
        <button
          className={styles.arrowRight}
          aria-label="Next video"
          onClick={goToNext}
          disabled={currentIndex === videosLessons.length - 1}
        >
          <i className="fas fa-angle-right" />
        </button>
      </div>
    </div>
  );
}