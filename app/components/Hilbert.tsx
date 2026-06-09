import { useEffect, useState } from "react";
import clsx from "clsx";
import { pairs } from "d3";
import gsap from "gsap";
import { clamp } from "lodash-es";
import Canvas from "~/components/Canvas";
import { Vector } from "~/util/vector";

// thickness of lines
const thickness = (size: number) => clamp(0.002 * size, 0.35, 0.65);
// perspective factor
const perspective = 4;
// one full spin, in sec
const spin = 120;
// fade duration
const fade = 10;

// hilbert curve grid
export default function Hilbert({
  color = "",
  depth = 5,
  angle = 90,
  breaks = 4,
  className = "",
}) {
  const [{ segments = [] } = {}, setObjects] =
    useState<ReturnType<typeof generate>>();

  useEffect(() => {
    // use gsap context to efficiently clean up old animations
    const ctx = gsap.context(() => setObjects(generate(depth, angle, breaks)));
    return () => ctx.revert();
  }, [depth, angle, breaks]);

  return (
    <Canvas
      className={clsx("absolute inset-0 -z-10 size-full", className)}
      render={(ctx, { width, height }) => {
        if (!transform) return;

        // canvas size, cover
        const size = Math.max(width, height) / 2;

        // draw multi-segment line
        ctx.lineWidth = thickness(size);
        for (const { from, to, alpha, hue } of segments) {
          ctx.strokeStyle = color || `oklch(75% 0.1 ${hue})`;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(...transform(from, size));
          ctx.lineTo(...transform(to, size));
          ctx.stroke();
        }
      }}
    />
  );
}

// https://www.geeksforgeeks.org/python/python-hilbert-curve-using-turtle/
// https://craftofcoding.wordpress.com/2024/02/20/recursive-patterns-the-hilbert-curve/
const generate = (depth = 5, angle = 90, breaks = 4) => {
  // current point
  let point = new Vector(0, 0);
  // step direction/length
  let step = new Vector(0, 1);

  // list of points
  let points: Vector[] = [new Vector()];

  // add point to list
  const add = () => {
    point = point.add(step);
    points.push(point);
  };

  // generate one level of curve recursively
  const level = (depth: number, angle: number) => {
    if (depth <= 0) return;
    step = step.rotate(angle);
    level(depth - 1, -angle);
    add();
    step = step.rotate(-angle);
    level(depth - 1, angle);
    add();
    level(depth - 1, angle);
    step = step.rotate(-angle);
    add();
    level(depth - 1, -angle);
    step = step.rotate(angle);
  };

  // start recursion
  level(depth, angle);

  // fit points to [-1,1]
  points = Vector.fit(points);

  // split into segments
  const segments = pairs(points).map(([from, to], index) => ({
    from,
    to,
    alpha: 1,
    hue: 360 * (index / points.length),
    brightness: 0,
    index,
  }));

  for (const segment of segments) {
    if (!breaks) break;
    const delay =
      -(2 ** (breaks - 1)) * fade * (segment.index / segments.length);
    // animate fades
    gsap
      .timeline({ repeat: -1, delay, defaults: { ease: "expo.inOut" } })
      .to(segment, { alpha: 0, duration: fade / 3, delay: fade / 3 })
      .to(segment, { alpha: 1, duration: fade / 3 });
  }

  return { segments };
};

// rotation
const rotate = { x: -65, y: 0, z: 45 };

// animate rotation
gsap
  .timeline({ repeat: -1 })
  .to(rotate, { z: rotate.z + 360, duration: spin, ease: "linear" });

// project 2d point to 3d
const transform = (point: Vector, size: number) =>
  point
    .rotateZ(rotate.z)
    .rotateX(rotate.x)
    .perspective(perspective)
    .scale(size)
    .toArray(2);
