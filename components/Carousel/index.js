import { useState, useContext } from "react";
import { PageContext } from "../../pages/_app";
import { transformSrc } from "../../util/transformSrc";
import styles from "./index.module.scss";

// Simple image carousel with arrow navigation
export default function Carousel({ images = [], caption = "" }) {
  const { dir } = useContext(PageContext);
  const [index, setIndex] = useState(0);

  if (!images.length) return null;

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);
  const next = () => setIndex((i) => (i + 1) % images.length);

  return (
    <div className={styles.carousel}>
      <div className={styles.imageContainer}>
        <img
          src={transformSrc(images[index], dir)}
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
          {index + 1} / {images.length}
        </span>
        <button onClick={next} className={styles.arrow} aria-label="Next">
          <i className="fas fa-chevron-right" />
        </button>
      </div>
    </div>
  );
}
