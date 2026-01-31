import { useContext, useState, useEffect, useRef } from "react";
import { PageContext } from "../../pages/_app";
import { transformSrc } from "../../util/transformSrc";
import styles from "./index.module.scss";

// Simple row of images with fixed height
// Hides images from the end if they don't fit
export default function ImageRow({ images = [], height = 250, gap = 20 }) {
  const { dir } = useContext(PageContext);
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(null);
  const [imageWidths, setImageWidths] = useState(null);

  // Parse height in case it's a string like "200px"
  const numericHeight = typeof height === "string" ? parseInt(height, 10) : height;

  // Load all image dimensions on mount
  useEffect(() => {
    let cancelled = false;
    setImageWidths(null);
    setVisibleCount(null);

    Promise.all(
      images.map((src) => new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(numericHeight * (img.naturalWidth / img.naturalHeight));
        img.onerror = () => resolve(numericHeight);
        img.src = transformSrc(src, dir);
      }))
    ).then((widths) => {
      if (!cancelled) setImageWidths(widths);
    });

    return () => { cancelled = true; };
  }, [images, numericHeight, dir]);

  // Calculate visible count when widths are loaded or window resizes
  useEffect(() => {
    if (!imageWidths) return;

    const calculate = () => {
      const container = containerRef.current;
      if (!container) return;

      // Use page width (1100px) or viewport width if smaller
      const viewportWidth = typeof window !== "undefined" ? window.innerWidth : 1100;
      const availableWidth = Math.min(1100, viewportWidth - 80);
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
      {visibleCount !== null && images.slice(0, visibleCount).map((src, index) => (
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
