import { useState, useRef, useEffect, useContext, useCallback } from "react";
import Markdownify from "../Markdownify";
import Clickable from "../Clickable";
import { bucket } from "../../data/site.yaml";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";

// change provided srcs (png & mp4) to external bucket location for production.
const transformSrc = (src, dir) => {
  if (src.startsWith("http")) {
    return src;
  } else if (process.env.mode === "production" && !src.endsWith("svg")) {
    return bucket + dir + src;
  } else {
    return dir + src;
  }
};

// return dimensions to display image/video at, based on intrinsic dimensions
// https://www.desmos.com/calculator/baf0zz662q
const autoSize = ({ width, height }) => {
  const page = 960; // page column width. keep synced with $page in sass
  const ratio = 4; // width to height ratio at which image width matches page column width

  return {
    width: page * Math.sqrt(width / height / ratio) || "100%",
    maxHeight: page * Math.sqrt(height / width / ratio) || "100%",
  };
};

const Figure = ({
  id = "",
  image: imageSrc = "",
  video: videoSrc = "",
  show: initialShow = "",
  caption: neutralCaption = "",
  imageCaption = "",
  videoCaption = "",
  width: manualWidth = 0,
  height: manualHeight = 0,
  loop = false,
}) => {
  // whether to show image or video
  initialShow =
    initialShow || (imageSrc ? "image" : "") || (videoSrc ? "video" : "") || "";
  const [show, setShow] = useState(initialShow);
  // intrinsic image/video dimensions
  const [image, setImage] = useState({});
  const [video, setVideo] = useState({});
  // image/video elements
  const imageRef = useRef();
  const videoRef = useRef();
  // page front matter
  const { dir } = useContext(PageContext);

  // determine frame dimensions
  let frame = {};
  if (manualWidth) frame = { width: manualWidth };
  else if (manualHeight) frame = { maxHeight: manualHeight };
  else if (show === "image") frame = autoSize(image);
  else if (show === "video") frame = autoSize(video);

  // determine controls dimensions
  let controls = { width: frame.width };

  // determine caption to show
  let caption = "";
  if (show === "image") caption = imageCaption || neutralCaption;
  if (show === "video") caption = videoCaption || neutralCaption;

  // update intrinsic dimensions of image/video
  const updateDimensions = useCallback(() => {
    const image = imageRef.current;
    const video = videoRef.current;
    if (image) {
      const { naturalWidth: width, naturalHeight: height } = image;
      setImage({ width, height });
    }
    if (video) {
      const { videoWidth: width, videoHeight: height } = video;
      setVideo({ width, height });
    }
  }, []);

  // update intrinsic dimensions on page load, in case on-load events don't
  // trigger due to image/video being loaded from cache
  useEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  // autoplay/pause video when it goes in/out of view
  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(videoAutoplay);
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <figure id={id} className={styles.figure} data-show={show}>
      {imageSrc && videoSrc && (
        <div className={styles.controls} style={controls}>
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
      <div className={styles.frame} style={frame}>
        {imageSrc && (
          <img
            ref={imageRef}
            className={styles.image}
            src={transformSrc(imageSrc, dir)}
            alt={imageCaption}
            loading="lazy"
            // update intrinsic dimensions after loaded
            onLoad={updateDimensions}
          />
        )}
        {videoSrc && (
          <video
            ref={videoRef}
            className={styles.video}
            muted
            controls
            loop={loop}
            preload="metadata"
            // update intrinsic dimensions after loaded
            onLoadedMetadata={updateDimensions}
          >
            <source src={transformSrc(videoSrc, dir)} />
          </video>
        )}
      </div>
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
