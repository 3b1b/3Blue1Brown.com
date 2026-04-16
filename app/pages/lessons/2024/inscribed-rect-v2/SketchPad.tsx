import type { Dispatch, SetStateAction } from "react";
import { useRef } from "react";
import {
  useElementSize,
  useEventListener,
  useMousePressed,
} from "@reactuses/core";
import { clamp } from "lodash-es";
import Canvas from "~/components/Canvas";

export type Point = [number, number];

type Props = {
  points: Point[];
  setPoints: Dispatch<SetStateAction<Point[]>>;
};

export default function SketchPad({ points, setPoints }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  const [width, height] = useElementSize(ref);

  const [pressed] = useMousePressed(ref);

  useEventListener("pointerdown", () => setPoints([]), ref);

  useEventListener("pointermove", (event: PointerEvent) => {
    if (!pressed) return;
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    let x = (event.clientX - left) / width - 0.5;
    let y = (event.clientY - top) / height - 0.5;
    x = clamp(x, -0.5, 0.5);
    y = clamp(y, -0.5, 0.5);
    setPoints((points) => [...points, [x, y]]);
  });

  return (
    <div className="absolute top-0 left-0">
      <Canvas
        ref={ref}
        className="size-50 cursor-crosshair touch-none bg-white"
        render={(ctx) => {
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.beginPath();
          points.forEach(([x, y], index) => {
            if (index === 0) ctx.moveTo(x * width * 2, y * height * 2);
            else ctx.lineTo(x * width * 2, y * height * 2);
          });
          ctx.stroke();
        }}
      />
      Draw on me!
    </div>
  );
}
