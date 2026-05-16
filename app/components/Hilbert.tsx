import { useCallback, useState } from "react";
import clsx from "clsx";
import { pairs } from "d3";
import gsap from "gsap";
import { max, min } from "lodash-es";
import Canvas from "~/components/Canvas";
import { project, rotateX, rotateZ } from "~/util/math";
import { Vector } from "~/util/vector";

// order of hilbert curve
const order = 5;
// angle of turns in hilbert curve
const angle = 90;
// thickness of line, in px
const thickness = 1;
// perspective
const perspective = 4;
// one full spin, in sec
const spin = 120;
// fade duration
const fade = 10;
// how much to stagger fade
const stagger = 100;

// hilbert curve grid
export default function Hilbert({ color = "", className = "" }) {
  const [{ segments = [], transform } = {}, setObjects] =
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
        if (!transform) return;

        // draw multi-segment line
        ctx.lineWidth = thickness;
        for (const { from, to, alpha, hue } of segments) {
          ctx.strokeStyle = color || `oklch(75% 0.1 ${hue})`;
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.moveTo(...transform(from));
          ctx.lineTo(...transform(to));
          ctx.stroke();
        }
      }}
      onChange={onChange}
    />
  );
}

const generate = (width: number, height: number) => {
  // canvas size, contain
  const size = Math.min(width, height);

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
      .divide((right - left) / 2, (bottom - top) / 2)
      // scale to fit canvas
      .scale(size),
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

  // set animation defaults
  gsap.defaults({ ease: "linear" });

  // animate rotation
  gsap
    .timeline({ repeat: -1 })
    .to(rotate, { z: rotate.z + 360, duration: spin });

  for (const segment of segments) {
    const delay = -(segment.index / segments.length) * stagger;
    // animate fades
    gsap
      .timeline({ repeat: -1, delay })
      .to(segment, {
        alpha: 0,
        duration: fade / 3,
        delay: fade / 3,
        ease: "expo.inOut",
      })
      .to(segment, { alpha: 1, duration: fade / 3, ease: "expo.inOut" });
    // animate hue
    gsap
      .timeline({ repeat: -1, delay })
      .to(segment, { hue: 360, duration: fade });
  }

  // project 2d point to 3d
  const transform = (p: Vector) => {
    let point = { ...p, z: 0 };
    point = rotateZ(point, rotate.z);
    point = rotateX(point, rotate.x);
    const projected = project(point, size * perspective);
    return [projected.x, projected.y] as const;
  };

  return { segments, transform };
};
