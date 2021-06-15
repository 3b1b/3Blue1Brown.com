import styles from "./index.module.scss";

const Video = ({ id, playlist, width }) => {
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
