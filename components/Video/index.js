import styles from "./index.module.scss";

// youtube video embed
const Video = ({ id, playlist, width }) => {
  // if no id, don't render
  if (!id) return null;

  // determine embed link
  let src;
  if (playlist)
    src = `https://www.youtube.com/embed/videoseries?list=${id}&rel=0`;
  else src = `https://www.youtube.com/embed/${id}?rel=0`;

  return (
    <div className={styles.video} style={{ width: width || "100%" }}>
      <div className={styles.frame}>
        <iframe className={styles.iframe} src={src} allowFullScreen />
      </div>
    </div>
  );
};

export default Video;
