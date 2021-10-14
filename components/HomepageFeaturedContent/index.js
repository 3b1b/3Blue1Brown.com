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
import Link from "next/link";
import styles from "./index.module.scss";
import { transformSrc } from "../../util/transformSrc";

HomepageFeaturedContent.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};

export default function HomepageFeaturedContent({ title, subtitle="", children }) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>
        <Markdownify>{subtitle}</Markdownify>
      </div>
      <div className={styles.featured}>
        <Carousel>{children}</Carousel>
      </div>
      <div className={styles.social}>
        <SocialIcons />
      </div>
    </div>
  );
}

const FeaturedItemContext = createContext({ lesson: null });

HomepageFeaturedItem.propTypes = {
  lesson: PropTypes.string.isRequired,
  caption: PropTypes.node.isRequired,
  children: PropTypes.node.isRequired,
};

export function HomepageFeaturedItem({ lesson, caption, children, link="" }) {
  if(link == ""){
    link = `/lessons/${lesson}`
  }
  return (
    <FeaturedItemContext.Provider value={{ lesson }}>
      <div>
        {lesson && <div className={styles.itemButtons}>
          <Clickable
            link={link}
            text="Watch"
            icon="fab fa-youtube"
          />
          <Clickable
            link={`${link}#title`}
            text="Read"
            icon="far fa-newspaper"
          />
        </div>}

        <figure className={styles.itemFigure}>
          {children}
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
