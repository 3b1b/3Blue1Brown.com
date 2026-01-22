import { useContext, useState, useEffect, useRef } from "react";
import { PageContext } from "../../pages/_app";
import { transformSrc } from "../../util/transformSrc";
import styles from "./index.module.scss";

// Simple row of images with fixed height
// Hides images from the end if they don't fit
export default function ImageRow({ images = [], height = 250, gap = 20 }) {
  const { dir } = useContext(PageContext);
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(images.length);
  const [imageWidths, setImageWidths] = useState(null);

  // Load all image dimensions on mount
  useEffect(() => {
    let cancelled = false;

    Promise.all(
      images.map((src) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(height * (img.naturalWidth / img.naturalHeight));
        img.onerror = () => resolve(height);
        img.src = transformSrc(src, dir);
      }))
    ).then((widths) => {
      if (!cancelled) setImageWidths(widths);
    });

    return () => { cancelled = true; };
  }, [images, height, dir]);

  // Calculate visible count when widths are loaded or window resizes
  useEffect(() => {
    if (!imageWidths) return;

    const calculate = () => {
      const container = containerRef.current;
      if (!container) return;

      // Use page width (1100px) or viewport width if smaller
      const availableWidth = Math.min(1100, window.innerWidth - 80);
      let total = 0;
      let count = 0;

      for (let i = 0; i < imageWidths.length; i++) {
        const needed = imageWidths[i] + (i > 0 ? gap : 0);
        if (total + needed <= availableWidth) {
          total += needed;
          count++;
        } else {
          break;
        }
      }

      setVisibleCount(Math.max(1, count));
    };

    calculate();
    window.addEventListener("resize", calculate);
    return () => window.removeEventListener("resize", calculate);
  }, [imageWidths, gap]);

  if (!images.length) return null;

  return (
    <div ref={containerRef} className={styles.row} style={{ height, gap }}>
      {images.slice(0, visibleCount).map((src, index) => (
        <img
          key={index}
          src={transformSrc(src, dir)}
          alt=""
          className={styles.image}
        />
      ))}
    </div>
  );
}
