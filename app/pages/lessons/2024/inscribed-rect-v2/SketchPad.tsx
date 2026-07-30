import type { Dispatch, SetStateAction } from "react";
import { clamp } from "lodash-es";
import Canvas from "~/components/Canvas";

export type Point = [number, number];

type Props = {
  points: Point[];
  setPoints: Dispatch<SetStateAction<Point[]>>;
};

export default function SketchPad({ points, setPoints }: Props) {
  return (
    <div className="absolute top-0 left-0">
      <Canvas
        className="size-50 cursor-crosshair touch-none bg-white"
        onPointerDown={() => setPoints([])}
        onPointerMove={({ currentTarget, clientX, clientY, buttons }) => {
          if (!buttons) return;
          const { left, top, width, height } =
            currentTarget.getBoundingClientRect();
          let x = (clientX - left) / width - 0.5;
          let y = (clientY - top) / height - 0.5;
          x = clamp(x, -0.5, 0.5);
          y = clamp(y, -0.5, 0.5);
          setPoints((points) => [...points, [x, y]]);
        }}
        render={(ctx, { width, height }) => {
          ctx.strokeStyle = "black";
          ctx.lineWidth = 2;
          ctx.beginPath();
          points.forEach(([x, y], index) => {
            if (index === 0) ctx.moveTo(x * width, y * height);
            else ctx.lineTo(x * width, y * height);
          });
          ctx.stroke();
        }}
      />
      Draw on me!
    </div>
  );
}
