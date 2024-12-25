import { useState, useEffect, useRef, useCallback } from "react";
import styles from "./SketchPad.module.scss";

export default function SketchPad({ points, setPoints, width, height }) {
  const ref = useRef();
  const [sketching, setSketching] = useState(false);

  const [hasInteracted, setHasInteracted] = useState(false);

  const addSketchPoint = useCallback(
    (event) => {
      const rect = ref.current.getBoundingClientRect();

      let mx, my;
      if (event.touches) {
        mx = event.touches[0].clientX;
        my = event.touches[0].clientY;
      } else {
        mx = event.clientX;
        my = event.clientY;
      }

      const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

      setPoints((points) => [
        ...points,
        [
          clamp((mx - (rect.left + rect.right) / 2) / rect.width, -0.5, 0.5),
          clamp((my - (rect.top + rect.bottom) / 2) / rect.height, -0.5, 0.5),
        ],
      ]);
    },
    [setPoints]
  );

  const renderSketchpad = useCallback(
    (canvas, points) => {
      const ctx = canvas.getContext("2d");
      ctx.setTransform(1, 0, 0, 1, width / 2, height / 2);

      ctx.clearRect(-width / 2, -height / 2, width, height);

      if (points.length > 0) {
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(points[0][0] * width, points[0][1] * height);
        for (let i = 0; i < points.length; i++) {
          ctx.lineTo(points[i][0] * width, points[i][1] * height);
        }
        ctx.closePath();
        ctx.stroke();
      }
    },
    [width, height]
  );

  useEffect(() => {
    const canvas = ref.current;
    if (canvas) {
      renderSketchpad(canvas, points);
    }
  }, [points, renderSketchpad]);

  const onMouseDown = useCallback(
    (event) => {
      event.preventDefault();
      setSketching(true);
      setPoints([]);
      addSketchPoint(event);
      setHasInteracted(true);
    },
    [setPoints, addSketchPoint]
  );

  const onMouseMove = useCallback(
    (event) => {
      if (sketching) {
        event.preventDefault();
        addSketchPoint(event);
      }
    },
    [sketching, addSketchPoint]
  );

  const onMouseUp = useCallback(() => {
    if (sketching) {
      setSketching(false);
    }
  }, [sketching]);

  useEffect(() => {
    document.addEventListener("mouseup", onMouseUp);
    document.addEventListener("touchend", onMouseUp);

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("touchmove", onMouseMove);

    return () => {
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchend", onMouseUp);

      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("touchmove", onMouseMove);
    };
  }, [onMouseUp, onMouseMove]);

  return (
    <div className={styles.sketchpadContainer}>
      <canvas
        ref={ref}
        className={styles.sketchpad}
        width={width}
        height={height}
        onMouseDown={onMouseDown}
        onTouchStart={onMouseDown}
      />
      <div className={styles.sketchpadLabel} data-visible={!hasInteracted}>
        Draw on me!
      </div>
    </div>
  );
}
