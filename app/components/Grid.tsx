import { useEffect, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { clamp, cloneDeep, range } from "lodash-es";
import Canvas from "~/components/Canvas";
import { Vector } from "~/util/vector";

// thickness of lines
const thickness = (size: number) => clamp(0.002 * size, 0.35, 0.65);
// perspective factor
const perspective = 4;
// number of cells in each direction
const cells = 3 * 4;
// every nth line is major
const major = 4;
// one full spin, in sec
const spin = 120;
// line draw duration
const draw = 5;
// how much to stagger draw
const stagger = 0.25;
// colors
const colorMinor = "oklch(60% 0 240)";
const colorMajor = "oklch(55% 0.15 240)";

// simple cartesian grid viz
export default function Grid({ className = "" }) {
  const [{ minorLines = [], majorLines = [] } = {}, setObjects] =
    useState<ReturnType<typeof generate>>();

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
        const lineWidth = thickness(size);

        // draw minor lines
        ctx.strokeStyle = colorMinor;
        ctx.lineWidth = lineWidth;
        for (const { horizontal, vertical } of minorLines) {
          ctx.beginPath();
          ctx.moveTo(...transform(horizontal.from, size));
          ctx.lineTo(...transform(horizontal.to, size));
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(...transform(vertical.from, size));
          ctx.lineTo(...transform(vertical.to, size));
          ctx.stroke();
        }

        // draw major lines
        ctx.strokeStyle = colorMajor;
        ctx.lineWidth = 3 * lineWidth;
        for (const { horizontal, vertical } of majorLines) {
          ctx.beginPath();
          ctx.moveTo(...transform(horizontal.from, size));
          ctx.lineTo(...transform(horizontal.to, size));
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(...transform(vertical.from, size));
          ctx.lineTo(...transform(vertical.to, size));
          ctx.stroke();
        }
      }}
    />
  );
}

const generate = () => {
  // intervals in each direction
  const intervals = range(-cells, cells + 1).map((index) => index / cells);

  // minor lines
  const minorLines = intervals.map((point, index) => ({
    horizontal: { from: new Vector(-1, point), to: new Vector(-1, point) },
    vertical: { from: new Vector(point, -1), to: new Vector(point, -1) },
    index,
  }));

  // major lines
  const majorLines = cloneDeep(minorLines).filter(
    (_, index) => index % major === 0,
  );

  // set animation defaults
  gsap.defaults({ ease: "sine.inOut" });

  // animate minor lines
  for (const { horizontal, vertical, index } of minorLines) {
    gsap
      .timeline({ repeat: -1, delay: index * stagger + 1 })
      .to(horizontal.from, { x: 1, duration: draw })
      .to(horizontal.to, { x: 1, duration: draw, delay: draw / 2 });
    gsap
      .timeline({ repeat: -1, delay: index * stagger + 1 })
      .to(vertical.from, { y: 1, duration: draw })
      .to(vertical.to, { y: 1, duration: draw, delay: draw / 2 });
  }

  // animate major lines
  for (const { horizontal, vertical, index } of majorLines) {
    gsap
      .timeline({ repeat: -1, delay: index * stagger })
      .to(horizontal.from, { x: 1, duration: draw })
      .to(horizontal.to, { x: 1, duration: draw, delay: draw / 2 });
    gsap
      .timeline({ repeat: -1, delay: index * stagger })
      .to(vertical.from, { y: 1, duration: draw })
      .to(vertical.to, { y: 1, duration: draw, delay: draw / 2 });
  }

  return { minorLines, majorLines };
};

// rotation
const rotate = { x: -65, y: 0, z: 15 };

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
