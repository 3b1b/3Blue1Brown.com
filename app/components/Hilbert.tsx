import { useCallback, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { max, min } from "lodash-es";
import Canvas from "~/components/Canvas";
import { Vector } from "~/util/vector";

// order of hilbert curve
const order = 5;
// angle of turns in hilbert curve
const angle = 90;
// thickness of line, in px
const thickness = 1;
// colors
const color = "oklch(55% 0.15 240)";

// hilbert curve grid
export default function Hilbert({ className = "" }) {
  const [{ points = [] } = {}, setObjects] =
    useState<ReturnType<typeof generate>>();

  // when canvas size changes
  const onChange = useCallback((width: number, height: number) => {
    // use gsap context to efficiently clean up old animations
    const ctx = gsap.context(() => setObjects(generate(width, height)));
    return () => ctx.revert();
  }, []);

  return (
    <Canvas
      className={clsx("absolute inset-0 -z-10 size-full", className)}
      render={(ctx) => {
        ctx.lineWidth = thickness;
        ctx.strokeStyle = color;
        ctx.beginPath();
        for (const { x, y } of points) ctx.lineTo(x, y);
        ctx.stroke();
      }}
      onChange={onChange}
    />
  );
}

const generate = (_width: number, _height: number) => {
  // set animation defaults
  gsap.defaults({ ease: "sine.inOut" });

  // current point
  let point = new Vector(0, 0);
  // step direction/length
  let step = new Vector(1, 0);

  // list of points
  let points: Vector[] = [point];

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

  // scale to fit canvas
  const scale = Math.min(_width / width, _height / height);

  // center and scale points
  points = points.map((point) =>
    point.translate(-width / 2, -height / 2).scale(scale),
  );

  return { points };
};
