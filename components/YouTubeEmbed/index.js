import PropTypes from "prop-types";
import styles from "./index.module.scss";

YouTubeEmbed.propTypes = {
  video: PropTypes.string.isRequired,
};

// Simple YouTube video embed
export default function YouTubeEmbed({ video }) {
  if (!video) return null;

  return (
    <div className={styles.container}>
      <iframe
        src={`https://www.youtube.com/embed/${video}`}
        title="YouTube video"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}
