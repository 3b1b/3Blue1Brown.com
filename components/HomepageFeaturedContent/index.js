import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import PropTypes from "prop-types";
import Clickable from "../Clickable";
import PiCreature from "../PiCreature";
import SocialIcons from "../SocialIcons";
import Markdownify from "../Markdownify";
import Interactive from "../Interactive";
import Link from "next/link";
import styles from "./index.module.scss";
import { transformSrc } from "../../util/transformSrc";
import { PageContext } from "../../pages/_app";

HomepageFeaturedContent.propTypes = {
  title: PropTypes.string.isRequired,
  show_latest_video: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default function HomepageFeaturedContent({ title, show_latest_video=true, children}) {
  const { lessons } = useContext(PageContext);
  const lesson = [...lessons].sort((a, b) => {a.date - b.date})[0];

  var latest_video = (
    <HomepageFeaturedItem lesson={lesson.slug} caption={"Latest video: " + lesson.title} youtube_id={lesson.video} />
  );

  var items = show_latest_video ? [latest_video, ...children] : children;

  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.social}>
        <SocialIcons />
      </div>
      <div className={styles.featured}>
        <Carousel>{items}</Carousel>
      </div>
    </div>
  );
}

const FeaturedItemContext = createContext({ lesson: null });

HomepageFeaturedItem.propTypes = {
  lesson: PropTypes.string.isRequired,
  caption: PropTypes.node.isRequired,
};

export function HomepageFeaturedItem({
  lesson, caption,
  video_src="",
  interactive_src="",
  image_src="",
  youtube_id="",
  link="",
}) {
  if(link == ""){
    link = `/lessons/${lesson}`
  }

  var item;
  if (video_src != ""){
    item = <HomepageFeaturedVideo src={video_src} />;
  } else if (interactive_src != ""){
    item = <Interactive filename={interactive_src} aspectRatio={16 / 9} />
  } else if (image_src != "") {
    item = <img src={image_src} />
  } else if (youtube_id != ""){
    item = <HomepageFeaturedYouTube slug={youtube_id} />
  }

  return (
    <FeaturedItemContext.Provider value={{ lesson }}>
      <div>
        <figure className={styles.itemFigure}>
          {item}
          <figcaption className={styles.itemCaption}>
            <Link href={link}>
              <a>{caption}</a>
            </Link>
          </figcaption>
        </figure>
      </div>
    </FeaturedItemContext.Provider>
  );
}

HomepageFeaturedYouTube.propTypes = {
  slug: PropTypes.string.isRequired,
};

// Note, too much of this is copied over from LessonVideo

export function HomepageFeaturedYouTube({
  slug,
}) {
  const thumbnail = `https://img.youtube.com/vi/${slug}/maxresdefault.jpg`;

  const [showCoverImage, setShowCoverImage] = useState(true);  
  const startVideo = () => {
    setShowCoverImage(false);
  };

  return (
    <div>
    {showCoverImage && (
      <button className={styles.coverButton} onClick={startVideo}>
        <img
          className={styles.coverImage}
          src={thumbnail}
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
          title="YouTube Video"
          className={styles.iframe}
        src={`https://www.youtube-nocookie.com/embed/${slug}?rel=0&autoplay=1`}
          allow="autoplay"
          allowFullScreen
        />
      </div>
    )}
    </div>
  );
}

HomepageFeaturedVideo.propTypes = {
  src: PropTypes.string.isRequired,
  autoPlay: PropTypes.bool,
  loop: PropTypes.bool,
  muted: PropTypes.bool,
  controls: PropTypes.bool,
  width: PropTypes.number,
  height: PropTypes.number,
};

export function HomepageFeaturedVideo({
  src,
  dir = "/featured-content/",
  autoPlay = true,
  loop = true,
  muted = true,
  controls = false,
  width = 1920,
  height = 1080,
}) {
  const { visible } = useContext(CarouselContext);
  const { lesson } = useContext(FeaturedItemContext);
  const videoRef = useRef();

  return (
      <a className={styles.videoLink}>
        <video
          ref={videoRef}
          className={styles.video}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          width={width}
          height={height}
          preload="metadata"
          playsInline={true}
        >
          <source src={transformSrc(src, dir)} />
        </video>
      </a>
  );
}

const CarouselContext = createContext({ visible: false });

function Carousel({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const slideCount = Children.count(children);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((currentIndex) =>
      currentIndex === 0 ? slideCount - 1 : currentIndex - 1
    );
  }, [slideCount]);

  const goToNext = useCallback(() => {
    setCurrentIndex((currentIndex) =>
      currentIndex === slideCount - 1 ? 0 : currentIndex + 1
    );
  }, [slideCount]);

  // Adjust height to match current slide
  const slidesRef = useRef();
  const [currentHeight, setCurrentHeight] = useState(undefined);
  useEffect(() => {
    const updateHeight = () => {
      const currentSlide = slidesRef.current.children.item(currentIndex);
      const height = currentSlide.getBoundingClientRect().height;
      setCurrentHeight(height);
    };

    updateHeight();

    // Periodically update height to prevent a whole host
    // of tricky-to-track-down bugs
    const interval = setInterval(updateHeight, 200);

    return () => {
      clearInterval(interval);
    };
  }, [currentIndex]);

  return (
    <div className={styles.carousel}>
      <button
        className={styles.arrowLeft}
        aria-label="Previous"
        onClick={goToPrevious}
        disabled={currentIndex === 0}
      >
        <i className="fas fa-angle-left" />
      </button>
      <div
        className={styles.slides}
        ref={slidesRef}
        style={{ maxHeight: currentHeight }}
      >
        {Children.map(children, (child, index) => {
          const translate = -100 * currentIndex;
          const visible = index === currentIndex;

          return (
            <CarouselContext.Provider value={{ visible }}>
              <div
                className={styles.slide}
                data-visible={visible}
                style={{
                  transform: `translateX(${translate}%)`,
                }}
              >
                {child}
              </div>
            </CarouselContext.Provider>
          );
        })}
      </div>
      <button
        className={styles.arrowRight}
        aria-label="Next"
        onClick={goToNext}
        disabled={currentIndex === slideCount - 1}
      >
        <i className="fas fa-angle-right" />
      </button>
    </div>
  );
}
