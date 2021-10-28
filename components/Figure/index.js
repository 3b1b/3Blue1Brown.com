import { useState, useRef, useEffect, useContext, useCallback } from "react";
import PropTypes from "prop-types";
import Markdownify from "../Markdownify";
import Clickable from "../Clickable";
import { PageContext } from "../../pages/_app";
import styles from "./index.module.scss";
import { useSectionWidth } from "../Section";
import { transformSrc } from "../../util/transformSrc";

Figure.propTypes = {
  id: PropTypes.string,
  image: requireImageOrVideo,
  video: requireImageOrVideo,
  show: PropTypes.oneOf(["image", "video"]),
  caption: PropTypes.string,
  imageCaption: PropTypes.string,
  videoCaption: PropTypes.string,
  width: PropTypes.number,
  height: PropTypes.number,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
};

function requireImageOrVideo(props, propName, componentName) {
  if (!props.image && !props.video) {
    return new Error(`${componentName} requires one of "image" or "video"`);
  }

  if (propName === "image" && !props.video && typeof props.image !== "string") {
    return new Error(`image must be a string in ${componentName}`);
  }

  if (propName === "video" && !props.image && typeof props.video !== "string") {
    return new Error(`video must be a string in ${componentName}`);
  }
}

// return dimensions to display image/video at, based on intrinsic dimensions
// https://www.desmos.com/calculator/baf0zz662q
const autoSize = ({ width, height }, sectionWidth) => {
  const page = sectionWidth === "narrow" ? 780 : 1100; // page column width. keep synced with $page in sass
  const ratio = 4; // width to height ratio at which image width matches page column width

  return {
    width: page * Math.sqrt(width / height / ratio) || "100%",
    height: page * Math.sqrt(height / width / ratio) || undefined,
  };
};

// figure component to show image and/or video and caption, with controls to
// switch between
export default function Figure({
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
  muted = true,
}) {
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

  const sectionWidth = useSectionWidth();

  // Check if this file's dimensions were saved at build time,
  // and if so, use those. (Otherwise that data will be populated
  // as soon as the media file actually loads.)
  const { mediaDimensions } = useContext(PageContext);
  useEffect(() => {
    const imagePath = dir + imageSrc;
    const imageDims = mediaDimensions[imagePath];
    if (imageDims) {
      setImage(imageDims);
    }

    const videoPath = dir + videoSrc;
    const videoDims = mediaDimensions[videoPath];
    if (videoDims) {
      setVideo(videoDims);
    }
  }, [dir, imageSrc, videoSrc, mediaDimensions]);

  // determine frame dimensions
  let frame = {};
  if (manualWidth) frame = { width: manualWidth };
  else if (manualHeight) frame = { maxHeight: manualHeight };
  else if (show === "image") frame = autoSize(image, sectionWidth);
  else if (show === "video") frame = autoSize(video, sectionWidth);

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
      if (width > 0 && height > 0) {
        setImage({ width, height });
      }
    }
    if (video) {
      const { videoWidth: width, videoHeight: height } = video;
      if (width > 0 && height > 0) {
        setVideo({ width, height });
      }
    }
  }, []);

  // update intrinsic dimensions on page load, in case on-load events don't
  // trigger due to image/video being loaded from cache
  useEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  // if no image/video, don't render
  if (!imageSrc && !videoSrc) return null;

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
            onClick={() => {
              setShow("video");

              if (videoRef.current) {
                videoRef.current.currentTime = 0;
                videoRef.current.play();
              }
            }}
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
            muted={muted}
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
}
