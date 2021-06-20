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
    width: page * Math.sqrt(width / height / ratio),
  };
};

const Figure = ({
  image: imageSrc = "",
  video: videoSrc = "",
  show: initialShow = "",
  caption: defaultCaption = "",
  imageCaption = "",
  videoCaption = "",
  width: manualWidth = 0,
  height: manualHeight = 0,
  loop = false,
}) => {
  // whether to show image or video
  const [show, setShow] = useState(
    initialShow || (imageSrc ? "image" : "") || (videoSrc ? "video" : "")
  );
  // intrinsic dimensions
  const [imageDimensions, setImageDimensions] = useState({});
  const [videoDimensions, setVideoDimensions] = useState({});
  // display dimensions
  const [imageStyle, setImageStyle] = useState({});
  const [videoStyle, setVideoStyle] = useState({});
  // controls width
  const [controlWidth, setControlWidth] = useState(0);
  // caption to show
  const [caption, setCaption] = useState("");
  // image/video elements
  const imageRef = useRef();
  const videoRef = useRef();
  // page front matter
  const { dir } = useContext(PageContext);

  // update caption
  useEffect(() => {
    if (show === "image") setCaption(imageCaption || defaultCaption);
    if (show === "video") setCaption(videoCaption || defaultCaption);
  }, [show, defaultCaption, imageCaption, videoCaption]);

  // update intrinsic size of image and video
  const updateDimensions = useCallback(() => {
    const image = imageRef.current;
    const video = videoRef.current;
    if (image) {
      const { naturalWidth: width, naturalHeight: height } = image;
      setImageDimensions({ width, height });
    }
    if (video) {
      const { videoWidth: width, videoHeight: height } = video;
      setVideoDimensions({ width, height });
    }
  }, []);

  // update intrinsic dimensions on page load, in case on-load events don't
  // trigger due to image/video being loaded from cache
  useEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  // update display dimensions
  useEffect(() => {
    if (manualWidth) {
      setImageStyle({ width: manualWidth });
      setVideoStyle({ width: manualWidth });
    } else if (manualHeight) {
      setImageStyle({ height: manualHeight });
      setVideoStyle({ height: manualHeight });
    } else {
      setImageStyle(autoSize(imageDimensions));
      setVideoStyle(autoSize(videoDimensions));
    }
  }, [manualWidth, manualHeight, imageDimensions, videoDimensions]);

  useEffect(() => {
    if (imageStyle.width) setControlWidth(imageStyle.width);
    else if (imageStyle.height)
      setControlWidth(
        (imageStyle.height * imageDimensions.width) / imageDimensions.height
      );
  }, [imageDimensions, imageStyle]);

  // autoplay/pause video when it goes in/out of view
  useEffect(() => {
    if (!videoRef.current) return;
    const observer = new IntersectionObserver(videoAutoplay);
    observer.observe(videoRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <figure className={styles.figure} data-show={show}>
      {imageSrc && videoSrc && (
        <div className={styles.controls} style={{ width: controlWidth }}>
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
      {imageSrc && (
        <img
          ref={imageRef}
          className={styles.image}
          src={transformSrc(imageSrc, dir)}
          alt={imageCaption}
          loading="lazy"
          style={imageStyle}
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
          style={videoStyle}
          // update intrinsic dimensions after loaded
          onLoadedMetadata={updateDimensions}
        >
          <source src={transformSrc(videoSrc, dir)} />
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
