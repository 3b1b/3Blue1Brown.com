import { max, min } from "lodash-es";
import { Vector } from "~/util/vector";

// order of hilbert curve
const order = 5;
// angle of turns in hilbert curve
const angle = 90;
// length of each segment in svg units
const length = 20;
// thickness of line in svg units
const thickness = 1;

// generate points of hilbert curve
const hilbert = (order: number, angle = 90) => {
  // current point
  let point = new Vector(0, 0);
  // step direction/length
  let step = new Vector(length, 0);

  // list of points
  const points: Vector[] = [point];

  // generate one level of curve recursively
  const level = (depth: number, angle: number) => {
    // stop
    if (depth <= 0) return;

    // side 1
    step = step.rotate(angle);
    level(depth - 1, -angle);
    point = point.translate(step);
    points.push(point);

    // side 2
    step = step.rotate(-angle);
    level(depth - 1, angle);
    point = point.translate(step);
    points.push(point);

    // side 3
    level(depth - 1, angle);
    step = step.rotate(-angle);
    point = point.translate(step);
    points.push(point);

    // link
    level(depth - 1, -angle);
    step = step.rotate(angle);
  };

  // start recursion
  level(order, angle);

  // x coords
  const xs = points.map((p) => p.x);
  // y coords
  const ys = points.map((p) => p.y);

  // bounding box
  const left = min(xs) ?? 0;
  const right = max(xs) ?? 0;
  const top = min(ys) ?? 0;
  const bottom = max(ys) ?? 0;
  const width = right - left;
  const height = bottom - top;

  return { points, left, top, width, height };
};

// generate hilbert
const { points, left, top, width, height } = hilbert(order, angle);

export default function Hilbert() {
  return (
    <div
      className="
        absolute inset-0 -z-10 mask-b-from-0% mask-b-to-100% opacity-50
      "
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={[left, top, width, height].join(" ")}
        className="absolute top-1/2 -translate-y-1/2 perspective-rotate"
      >
        <linearGradient id="gradient">
          <stop offset="0%" stopColor="var(--color-secondary)" />
          <stop offset="25%" stopColor="var(--color-secondary)" />
          <stop offset="25%" stopColor="var(--color-theme)" />
        </linearGradient>
        <polyline
          fill="none"
          className="stroke-path"
          stroke="url(#gradient)"
          strokeWidth={thickness}
          points={points.map((point) => point.toString()).join(" ")}
          pathLength={1}
          style={{ animationDuration: 120 + "s" }}
        />
      </svg>
    </div>
  );
}
