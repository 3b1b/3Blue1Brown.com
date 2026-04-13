import { useState } from "react";
import PropTypes from "prop-types";
import styles from "./index.module.scss";

function extractYouTubeId(url) {
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return url; // assume raw ID if no pattern matches
}

VideoShowcase.propTypes = {
  videos: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      url: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default function VideoShowcase({ videos }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = videos[activeIndex];
  const videoId = extractYouTubeId(active.url);

  return (
    <div className={styles.showcase}>
      <div className={styles.tabs}>
        {videos.map((video, i) => (
          <button
            key={i}
            className={styles.tab}
            data-active={i === activeIndex}
            onClick={() => setActiveIndex(i)}
          >
            {video.title}
          </button>
        ))}
      </div>
      <div className={styles.player}>
        <iframe
          key={videoId}
          src={`https://www.youtube.com/embed/${videoId}`}
          title={active.title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </div>
  );
}
