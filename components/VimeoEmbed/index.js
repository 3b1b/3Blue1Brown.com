import PropTypes from "prop-types";
import styles from "./index.module.scss";

VimeoEmbed.propTypes = {
  video: PropTypes.string.isRequired,
  hash: PropTypes.string,
};

// Simple Vimeo video embed
export default function VimeoEmbed({ video, hash }) {
  if (!video) return null;

  const hashParam = hash ? `&h=${hash}` : "";

  return (
    <div className={styles.container}>
      <iframe
        src={`https://player.vimeo.com/video/${video}?badge=0&autopause=0&player_id=0&app_id=58479&title=0&byline=0&portrait=0&sidedock=0${hashParam}`}
        title="Vimeo video"
        frameBorder="0"
        allow="autoplay; fullscreen; picture-in-picture; clipboard-write; encrypted-media"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
      />
    </div>
  );
}
