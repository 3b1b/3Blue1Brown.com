import { useState, useContext, useEffect } from "react";
import { PageContext } from "../../pages/_app";
import { transformSrc } from "../../util/transformSrc";
import styles from "./index.module.scss";

// Simple image carousel with arrow navigation
export default function Carousel({ images = [], desktop_images = [], mobile_images = [], caption = "" }) {
  const { dir } = useContext(PageContext);
  const [index, setIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Use responsive images if provided, otherwise fall back to images
  const displayImages = desktop_images.length > 0 && mobile_images.length > 0
    ? (isMobile ? mobile_images : desktop_images)
    : images;

  if (!displayImages.length) return null;

  const prev = () => setIndex((i) => (i - 1 + displayImages.length) % displayImages.length);
  const next = () => setIndex((i) => (i + 1) % displayImages.length);

  return (
    <div className={styles.carousel}>
      <div className={styles.imageContainer}>
        <img
          src={transformSrc(displayImages[index], dir)}
          alt=""
          className={styles.image}
        />
      </div>
      {caption && <p className={styles.caption}>{caption}</p>}
      <div className={styles.controls}>
        <button onClick={prev} className={styles.arrow} aria-label="Previous">
          <i className="fas fa-chevron-left" />
        </button>
        <span className={styles.indicator}>
          {index + 1} / {displayImages.length}
        </span>
        <button onClick={next} className={styles.arrow} aria-label="Next">
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}
