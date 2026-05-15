import { useCallback, useState } from "react";
import clsx from "clsx";
import gsap from "gsap";
import { cloneDeep, range } from "lodash-es";
import Canvas from "~/components/Canvas";
import { project, rotateX, rotateZ } from "~/util/3d";

// thickness of lines, in px
const thickness = 1;
// number of cells in each direction
const cells = 3 * 4;
// every nth line is major
const major = 4;
// perspective
const perspective = 4;
// how long to complete 1 full spin, in sec
const spin = 120;
// how long to complete 1 full dash draw, in sec
const draw = 5;
// how much to stagger each line animation, in sec
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
          ctx.moveTo(...transform(horizontal.x1, horizontal.y1));
          ctx.lineTo(...transform(horizontal.x2, horizontal.y2));
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(...transform(vertical.x1, vertical.y1));
          ctx.lineTo(...transform(vertical.x2, vertical.y2));
          ctx.stroke();
        }

        // draw major lines
        ctx.strokeStyle = colorMajor;
        ctx.lineWidth = 2 * thickness;
        for (const { horizontal, vertical } of majorLines) {
          ctx.beginPath();
          ctx.moveTo(...transform(horizontal.x1, horizontal.y1));
          ctx.lineTo(...transform(horizontal.x2, horizontal.y2));
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(...transform(vertical.x1, vertical.y1));
          ctx.lineTo(...transform(vertical.x2, vertical.y2));
          ctx.stroke();
        }
      }}
      onChange={onChange}
    />
  );
}

const generate = (width: number, height: number) => {
  // set animation defaults
  gsap.defaults({ ease: "sine.inOut" });

  // intervals in each direction
  const intervals = range(-cells, cells + 1).map((index) => index / cells);

  // minor lines
  const minorLines = intervals.map((point, index) => ({
    horizontal: { x1: -1, x2: -1, y1: point, y2: point },
    vertical: { x1: point, x2: point, y1: -1, y2: -1 },
    index,
  }));

  // major lines
  const majorLines = cloneDeep(minorLines).filter(
    (_, index) => index % major === 0,
  );

  // animate minor lines
  for (const { horizontal, vertical, index } of minorLines) {
    gsap
      .timeline({ repeat: -1, delay: index * stagger + 1 })
      .to(horizontal, { x2: 1, duration: draw })
      .to(horizontal, { x1: 1, duration: draw, delay: draw / 2 });
    gsap
      .timeline({ repeat: -1, delay: index * stagger + 1 })
      .to(vertical, { y2: 1, duration: draw })
      .to(vertical, { y1: 1, duration: draw, delay: draw / 2 });
  }

  // animate major lines
  for (const { horizontal, vertical, index } of majorLines) {
    gsap
      .timeline({ repeat: -1, delay: index * stagger })
      .to(horizontal, { x2: 1, duration: draw })
      .to(horizontal, { x1: 1, duration: draw, delay: draw / 2 });
    gsap
      .timeline({ repeat: -1, delay: index * stagger })
      .to(vertical, { y2: 1, duration: draw })
      .to(vertical, { y1: 1, duration: draw, delay: draw / 2 });
  }

  // rotation
  const rotate = { x: -65, y: 0, z: 15 };

  // animate rotation
  gsap
    .timeline({ repeat: -1 })
    .to(rotate, { z: rotate.z + 360, duration: spin, ease: "linear" });

  // canvas size
  const size = Math.max(width, height);
  const half = size / 2;

  // project 2d point to 3d
  const transform = (x: number, y: number) => {
    let point = { x: x * half, y: y * half, z: 0 };
    point = rotateZ(point, rotate.z);
    point = rotateX(point, rotate.x);
    const projected = project(point, size * perspective);
    return [projected.x, projected.y] as const;
  };

  return { minorLines, majorLines, transform };
};
