import { useEffect, useState } from "react";
import clsx from "clsx";
import { pairs } from "d3";
import gsap from "gsap";
import { max, min } from "lodash-es";
import Canvas from "~/components/Canvas";
import { project, rotateX, rotateZ } from "~/util/math";
import { Vector } from "~/util/vector";

// thickness of lines, as % of canvas size
const thickness = 0.001;
// perspective factor
const perspective = 10;
// order of hilbert curve
const order = 5;
// angle of turns in hilbert curve
const angle = 90;
// one full spin, in sec
const spin = 120;
// fade duration
const fade = 10;
// how much to stagger fade
const stagger = 0.1;

// hilbert curve grid
export default function Hilbert({ color = "", className = "" }) {
  const [{ segments = [], transform } = {}, setObjects] =
    useState<ReturnType<typeof generate>>();

  // when canvas size changes
  useEffect(() => {
    // use gsap context to efficiently clean up old animations
    const ctx = gsap.context(() => setObjects(generate()));
    return () => ctx.revert();
  }, []);

  return (
    <Canvas
      className={clsx("absolute inset-0 -z-10 size-full", className)}
      render={(ctx, width, height) => {
        if (!transform) return;

        // canvas size, cover
        const size = Math.max(width, height) / 2;

        // draw multi-segment line
        ctx.lineWidth = thickness * size;
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

const generate = () => {
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

  // transform points
  points = points.map((point) =>
    point
      // center
      .translate(-(left + right) / 2, -(top + bottom) / 2)
      // normalize to [-1,1]
      .divide((right - left) / 2, (bottom - top) / 2),
  );

  // split into segments
  const segments = pairs(points).map(([from, to], index) => ({
    from,
    to,
    alpha: 1,
    hue: 0,
    brightness: 0,
    index,
  }));

  // rotation
  const rotate = { x: -65, y: 0, z: 45 };

  // animate rotation
  gsap
    .timeline({ repeat: -1 })
    .to(rotate, { z: rotate.z + 360, duration: spin, ease: "linear" });

  for (const segment of segments) {
    const delay = -segment.index * stagger;
    // animate fades
    gsap
      .timeline({ repeat: -1, delay, defaults: { ease: "expo.inOut" } })
      .to(segment, { alpha: 0, duration: fade / 3, delay: fade / 3 })
      .to(segment, { alpha: 1, duration: fade / 3 });
    // animate hue
    gsap
      .timeline({ repeat: -1, delay })
      .to(segment, { hue: 360, duration: fade, ease: "linear" });
  }

  // project 2d point to 3d
  const transform = (p: Vector, size: number) => {
    let point = { ...p, z: 0 };
    point = rotateZ(point, rotate.z);
    point = rotateX(point, rotate.x);
    const projected = project(point, perspective);
    return [projected.x * size, projected.y * size] as const;
  };

  return { segments, transform };
};
