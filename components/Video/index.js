import { useState } from "react";
import styles from "./index.module.scss";

// youtube video embed
const Video = ({ id, playlist, width, coverImage = !playlist }) => {
  const [showCoverImage, setShowCoverImage] = useState(coverImage);

  // if no id, don't render
  if (!id) return null;

  // determine embed link
  let src;
  if (playlist)
    src = `https://www.youtube.com/embed/videoseries?list=${id}&rel=0`;
  else src = `https://www.youtube-nocookie.com/embed/${id}?rel=0`;

  if (coverImage) {
    // If the user already had to click on a cover image, then they
    // should not have to click again to play the video
    src += "&autoplay=1";
  }

  return (
    <div className={styles.video} style={{ width: width || "100%" }}>
      {showCoverImage && (
        <button
          className={styles.coverButton}
          onClick={() => setShowCoverImage(false)}
        >
          <img
            className={styles.coverImage}
            src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
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
            className={styles.iframe}
            src={src}
            allow="autoplay"
            allowFullScreen
          />
        </div>
      )}
    </div>
  );
};

export default Video;
