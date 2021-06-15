import { useState, useRef, useEffect } from "react";
import Markdownify from "../Markdownify";
import Clickable from "../Clickable";
import { bucket } from "../../data/site.yaml";
import styles from "./index.module.scss";

// change provided srcs to external bucket location for production
const transformSrc = (src) =>
  process.env.mode === "production" && !src.startsWith("http")
    ? bucket + src
    : src;

const Figure = ({
  image = "",
  video = "",
  show: initialShow = "",
  caption = "",
  imageCaption = "",
  videoCaption = "",
  width = 0,
  height = 0,
  loop = false,
}) => {
  // determine show mode
  if (!initialShow) {
    if (image) initialShow = "image";
    else if (video) initialShow = "video";
  }
  const [show, setShow] = useState(initialShow);

  // determine captions
  if (!imageCaption) imageCaption = caption;
  if (!videoCaption) videoCaption = caption;
  if (show === "image") caption = imageCaption;
  if (show === "video") caption = videoCaption;

  // determine sizes
  let style;
  if (width) style = { width };
  else if (height) style = { height };
  else style = { width: "100%" };

  // autoplay/pause video when it goes in/out of view
  const videoRef = useRef();
  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(videoAutoplay);
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className={styles.figure} data-show={show}>
      {image && video && (
        <div className={styles.controls}>
          <Clickable
            icon="far fa-image"
            text="Still"
            active={show === "image"}
            onClick={() => setShow("image")}
          />
          <Clickable
            icon="fas fa-film"
            text="Animation"
            active={show === "video"}
            onClick={() => setShow("video")}
          />
        </div>
      )}

      {image && (
        <img
          className={styles.image}
          src={transformSrc(image)}
          alt={imageCaption}
          style={style}
          loading="lazy"
        />
      )}

      {video && (
        <video
          ref={videoRef}
          className={styles.video}
          muted
          controls
          loop={loop}
          preload="metadata"
          style={style}
        >
          <source src={transformSrc(video)} />
        </video>
      )}

      {caption && (
        <figcaption className={styles.caption}>
          <Markdownify>{caption}</Markdownify>
        </figcaption>
      )}
    </figure>
  );
};

export default Figure;

// pause or play video based on in view status
const videoAutoplay = ([{ target, isIntersecting }]) => {
  if (isIntersecting) target.play();
  else target.pause();
};
