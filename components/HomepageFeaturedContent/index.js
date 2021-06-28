import {
  Children,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Clickable from "../Clickable";
import SocialIcons from "../SocialIcons";
import Link from "next/link";
import styles from "./index.module.scss";

export default function HomepageFeaturedContent({ title, children }) {
  return (
    <div className={styles.container}>
      <div className={styles.title}>{title}</div>
      <div className={styles.featured}>
        <Carousel>{children}</Carousel>
      </div>
      <div className={styles.social}>
        <div>Want more math in your life?</div>
        <SocialIcons />
      </div>
    </div>
  );
}

const FeaturedItemContext = createContext({ lesson: null });

export function HomepageFeaturedItem({ lesson, caption, children }) {
  return (
    <FeaturedItemContext.Provider value={{ lesson }}>
      <div>
        <div className={styles.itemButtons}>
          <Clickable
            link={`/lessons/${lesson}`}
            text="Watch"
            icon="fab fa-youtube"
          />
          <Clickable
            link={`/lessons/${lesson}#title`}
            text="Read"
            icon="far fa-newspaper"
          />
        </div>

        <figure className={styles.itemFigure}>
          {children}
          <figcaption className={styles.itemCaption}>
            <Link href={`/lessons/${lesson}`}>
              <a>{caption}</a>
            </Link>
          </figcaption>
        </figure>
      </div>
    </FeaturedItemContext.Provider>
  );
}

export function HomepageFeaturedVideo({
  src,
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

  useEffect(() => {
    if (autoPlay && visible) {
      videoRef.current.currentTime = 0;
      videoRef.current.play();
    }
    if (!visible) {
      videoRef.current.pause();
    }
  }, [visible, autoPlay]);

  return (
    <Link href={`/lessons/${lesson}`}>
      <a>
        <video
          ref={videoRef}
          className={styles.video}
          // autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          controls={controls}
          width={width}
          height={height}
          preload="none"
        >
          <source src={src} />
        </video>
      </a>
    </Link>
  );
}

const CarouselContext = createContext({ visible: false });

function Carousel({ children }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [autoRotate, setAutoRotate] = useState(true);

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

  // Auto-rotate when `autoRotate` is true
  useEffect(() => {
    if (autoRotate) {
      const interval = setInterval(() => {
        goToNext();
      }, 10000);

      return () => {
        clearInterval(interval);
      };
    }
  }, [autoRotate, goToNext]);

  // Disable auto-rotate after interacting
  const carouselRef = useRef();
  useEffect(() => {
    const onMouseDown = (event) => {
      if (carouselRef.current.contains(event.target)) {
        // That's an interaction!
        setAutoRotate(false);
      }
    };

    document.addEventListener("mousedown", onMouseDown);
    return () => {
      document.removeEventListener("mousedown", onMouseDown);
    };
  }, []);

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
    <div className={styles.carousel} ref={carouselRef}>
      <button
        className={styles.arrow}
        aria-label="Previous"
        onClick={goToPrevious}
      >
        <i className="fas fa-caret-left" />
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
      <button className={styles.arrow} aria-label="Next" onClick={goToNext}>
        <i className="fas fa-caret-right" />
      </button>
    </div>
  );
}
