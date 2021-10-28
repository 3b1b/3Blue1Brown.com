import { useState, useContext } from "react";
import Link from "next/link";
import { PageContext } from "../../pages/_app";
import Section from "../Section";
import topics from "../../data/topics.yaml";
import lessonRedirects from "../../data/lesson-redirects.yaml";
import styles from "./index.module.scss";

export default function LessonVideo({ timestamp, defaultToWide }) {
  const {
    video: videoId,
    topic: topicName,
    thumbnail,
    chapter,
    slug,
  } = useContext(PageContext);

  const topic = topics.find(({ name }) => name === topicName);

  const lessonIndex = topic
    ? topic.lessons.findIndex((lesson) => lesson === slug)
    : null;
  const prevLesson = topic ? topic.lessons[lessonIndex - 1] : null;
  const nextLesson = topic ? topic.lessons[lessonIndex + 1] : null;

  const minToggleWidth = 1000;
  const wideEnoughToToggle = () => {
    if (typeof window === "undefined") return false;
    return window.innerWidth > minToggleWidth;
  };

  const [wideVideo, setWideVideo] = useState(defaultToWide);
  const toggleExpansion = () => {
    if (!wideEnoughToToggle()) return;
    setWideVideo(!wideVideo);
    var id = wideVideo ? "__next" : "video-section";
    // smooth scroll to target
    document.getElementById(id).scrollIntoView({ behavior: "smooth" });
  };

  const [showCoverImage, setShowCoverImage] = useState(true);
  const startVideo = () => {
    if(!wideVideo) toggleExpansion();
    setShowCoverImage(false);
  };

  if (!videoId && !topic) return null;

  return (
    <Section
      id="video-section"
      dark={true}
      width={wideVideo ? "wide" : "narrow"}
    >
      <div
        className={styles.videoArea}
        data-showcoverimage={showCoverImage}
      >
        {topic && (
          <Link href={`/topics/${topic.slug}`}>
            <a className={styles.topicLink}>
              <i className="fas fa-arrow-left"></i>
              {topicName}
            </a>
          </Link>
        )}

        {!showCoverImage && wideEnoughToToggle() && (
          <button onClick={toggleExpansion} className={styles.expandButton}>
            {wideVideo ? (
              <i class="fas fa-compress-alt"></i>
            ) : (
              <i class="fas fa-expand-alt"></i>
            )}
          </button>
        )}

        {prevLesson && videoId && (
          <Link href={lessonRedirects[prevLesson] || `/lessons/${prevLesson}`}>
            <a className={styles.arrowLeft} aria-label="Previous">
              <i className="fas fa-angle-left" />
            </a>
          </Link>
        )}

        {videoId && (
          <div className={styles.video}>
            {showCoverImage && (
              <button className={styles.coverButton} onClick={startVideo}>
                <img
                  className={styles.coverImage}
                  src={thumbnail}
                  alt="Youtube video"
                />
                <svg
                  className={styles.coverPlayButton}
                  height="100%"
                  version="1.1"
                  viewBox="0 0 68 48"
                  width="100%"
                >
                  <path
                    d="M66.52,7.74c-0.78-2.93-2.49-5.41-5.42-6.19C55.79,.13,34,0,34,0S12.21,.13,6.9,1.55 C3.97,2.33,2.27,4.81,1.48,7.74C0.06,13.05,0,24,0,24s0.06,10.95,1.48,16.26c0.78,2.93,2.49,5.41,5.42,6.19 C12.21,47.87,34,48,34,48s21.79-0.13,27.1-1.55c2.93-0.78,4.64-3.26,5.42-6.19C67.94,34.95,68,24,68,24S67.94,13.05,66.52,7.74z"
                    fill="currentColor"
                  />
                  <path d="M 45,24 27,14 27,34" fill="#fff" />
                </svg>
              </button>
            )}
            {!showCoverImage && (
              <div className={styles.frame}>
                <iframe
                  title="YouTube Video"
                  className={styles.iframe}
                  src={`https://www.youtube-nocookie.com/embed/${videoId}?rel=0&autoplay=1${ timestamp ? '&start=' + timestamp : '' }`}
                  allow="autoplay"
                  allowFullScreen
                />
              </div>
            )}
          </div>
        )}

        {nextLesson && videoId && (
          <Link href={lessonRedirects[nextLesson] || `/lessons/${nextLesson}`}>
            <a className={styles.arrowRight} aria-label="Next">
              <i className="fas fa-angle-right" />
            </a>
          </Link>
        )}
      </div>
      {wideVideo && <div className={styles.bottomSpacer} />}
    </Section>
  );
}
