import { useCallback, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { cloneDeep, range } from "lodash-es";
import Canvas from "~/components/Canvas";
import { project, rotateX, rotateZ } from "~/util/math";
import { Vector } from "~/util/vector";

// thickness of lines, in px
const thickness = 1;
// number of cells in each direction
const cells = 3 * 4;
// every nth line is major
const major = 4;
// perspective
const perspective = 4;
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
  const [{ transform, minorLines = [], majorLines = [] } = {}, setObjects] =
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

        // draw minor lines
        ctx.strokeStyle = colorMinor;
        ctx.lineWidth = thickness;
        for (const { horizontal, vertical } of minorLines) {
          ctx.beginPath();
          ctx.moveTo(...transform(horizontal.from));
          ctx.lineTo(...transform(horizontal.to));
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(...transform(vertical.from));
          ctx.lineTo(...transform(vertical.to));
          ctx.stroke();
        }

        // draw major lines
        ctx.strokeStyle = colorMajor;
        ctx.lineWidth = 2 * thickness;
        for (const { horizontal, vertical } of majorLines) {
          ctx.beginPath();
          ctx.moveTo(...transform(horizontal.from));
          ctx.lineTo(...transform(horizontal.to));
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(...transform(vertical.from));
          ctx.lineTo(...transform(vertical.to));
          ctx.stroke();
        }
      }}
      onChange={onChange}
    />
  );
}

const generate = (width: number, height: number) => {
  // canvas size, cover
  const size = Math.max(width, height) / 2;

  // intervals in each direction
  const intervals = range(-cells, cells + 1).map(
    (index) => (index / cells) * size,
  );

  // minor lines
  const minorLines = intervals.map((point, index) => ({
    horizontal: {
      from: new Vector(-size, point),
      to: new Vector(-size, point),
    },
    vertical: { from: new Vector(point, -size), to: new Vector(point, -size) },
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
      .to(horizontal.from, { x: size, duration: draw })
      .to(horizontal.to, { x: size, duration: draw, delay: draw / 2 });
    gsap
      .timeline({ repeat: -1, delay: index * stagger + 1 })
      .to(vertical.from, { y: size, duration: draw })
      .to(vertical.to, { y: size, duration: draw, delay: draw / 2 });
  }

  // animate major lines
  for (const { horizontal, vertical, index } of majorLines) {
    gsap
      .timeline({ repeat: -1, delay: index * stagger })
      .to(horizontal.from, { x: size, duration: draw })
      .to(horizontal.to, { x: size, duration: draw, delay: draw / 2 });
    gsap
      .timeline({ repeat: -1, delay: index * stagger })
      .to(vertical.from, { y: size, duration: draw })
      .to(vertical.to, { y: size, duration: draw, delay: draw / 2 });
  }

  // rotation
  const rotate = { x: -65, y: 0, z: 15 };

  // animate rotation
  gsap
    .timeline({ repeat: -1 })
    .to(rotate, { z: rotate.z + 360, duration: spin, ease: "linear" });

  // project 2d point to 3d
  const transform = (p: Vector) => {
    let point = { ...p, z: 0 };
    point = rotateZ(point, rotate.z);
    point = rotateX(point, rotate.x);
    const projected = project(point, size * perspective);
    return [projected.x, projected.y] as const;
  };

  return { minorLines, majorLines, transform };
};
