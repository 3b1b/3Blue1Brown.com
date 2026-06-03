import { useMemo, useRef, useState } from "react";
import { pairs } from "d3";
import { orderBy, range } from "lodash-es";
import Canvas from "~/components/Canvas";
import { now } from "~/util/async";
import { pathToPoints } from "~/util/dom";
import { Vector } from "~/util/vector";

const examples = {
  pi: "m10.5 177.038 20.675 1.532c21.44-24.249 29.864-95.974 156.213-81.935-4.595 307.32-139.367 339.737-130.943 402.784 3.063 35.735 31.395 57.687 62.025 58.963 96.74-3.318 92.4-133.751 122.52-462.513h124.818c-6.637 115.883-24.76 231.767-26.802 345.353 1.532 75.554 47.477 115.884 107.971 116.394 99.548 3.318 130.943-112.82 130.943-162.339h-21.44c-2.043 40.84-21.697 70.194-63.558 71.98-114.097 1.532-51.305-200.626-50.54-369.857l135.538.766-.765-86.53C13.807 8.908 85.312-2.137 10.5 177.038",
  tau: "m217.7 147.93-5.373 53.177q-1.297 13.896-1.297 27.793 0 26.496 6.115 32.24 6.3 5.559 14.267 5.559 17.787 0 21.123-22.42h6.856q-6.115 51.509-40.948 51.509-36.501 0-36.501-41.874 0-21.122 4.074-52.621l6.856-53.362H174.53q-15.193 0-23.716 5.188-8.338 5.003-15.564 20.38h-6.67q5.93-20.38 14.081-32.24 8.153-12.043 15.564-16.12 7.412-4.26 22.049-4.26h91.16v27.051z",
};

export default function Fourier() {
  // shape to draw
  const [shape] = useState(examples.pi);

  // colors
  const [shapeColor] = useState("salmon");
  const [cycleColor] = useState("white");
  const [traceColor] = useState("#51c9ff");

  // line widths
  const [shapeThickness] = useState(1);
  const [cycleThickness] = useState(1);
  const [traceThickness] = useState(4);

  // other options
  const [count] = useState(500);
  const [slice] = useState(500);
  const [sort] = useState(true);
  const [tail] = useState(1000);
  const [speed] = useState(10);

  // points sampled from shape
  const points = useMemo(() => pathToPoints(shape, count), [shape, count]);

  // epicycles that reconstruct shape
  const cycles = useMemo(() => dft(points, slice, sort), [points, slice, sort]);
  // trail of points left by tip of epicycles
  const trace = useRef<Vector[]>([]);

  return (
    <>
      <Canvas
        className="absolute inset-0 -z-10 size-full"
        render={(ctx, width, height) => {
          // canvas size, contain
          const size = Math.min(width, height) / 4;

          // current time
          const time = speed * (now() / 1000);

          ctx.lineCap = "round";

          // draw shape
          {
            ctx.strokeStyle = shapeColor;
            ctx.lineWidth = shapeThickness;
            ctx.globalAlpha = 0.5;
            const [first, ...rest] = points;
            ctx.beginPath();
            ctx.moveTo(...transform(first!, size));
            for (const point of rest) ctx.lineTo(...transform(point, size));
            ctx.closePath();
            ctx.stroke();
          }

          // draw epicycles
          {
            ctx.strokeStyle = cycleColor;
            ctx.lineWidth = cycleThickness;
            ctx.globalAlpha = 0.75;
            let from = new Vector();
            for (const { frequency, amplitude, phase } of cycles) {
              const to = from.add(
                new Vector(amplitude, 0).rotate(phase + frequency * time),
              );
              ctx.beginPath();
              ctx.moveTo(...transform(from, size));
              ctx.lineTo(...transform(to, size));
              ctx.stroke();
              from = to;
            }

            // add last point to trace
            trace.current.unshift(from);
            if (trace.current.length > tail) trace.current.pop();
          }

          // draw trace
          {
            ctx.strokeStyle = traceColor;
            ctx.lineWidth = traceThickness;
            pairs(trace.current).forEach(([from, to], index) => {
              ctx.globalAlpha = 1 - index / trace.current.length;
              ctx.beginPath();
              ctx.moveTo(...transform(from, size));
              ctx.lineTo(...transform(to, size));
              ctx.stroke();
            });
          }
        }}
      />

      <div className="absolute top-0 left-0 flex items-end gap-4 p-4 text-black"></div>
    </>
  );
}

// discrete fourier transform
// https://www.jezzamon.com/fourier/
// https://dsp.stackexchange.com/questions/59068/how-to-get-fourier-coefficients-to-draw-any-shape-using-dft
const dft = (points: Vector[], slice = points.length - 1, sort = true) => {
  // dft to get epicycles
  let cycles = range(-points.length / 2, points.length / 2)
    // normalize frequency to [0,360)
    .map((frequency) => 360 * (frequency / points.length))
    .map((frequency) => {
      let result = new Vector();
      points.forEach(
        (point, index) =>
          (result = result.add(point.rotate(-frequency * index))),
      );
      result = result.scale(1 / points.length);
      return { frequency, amplitude: result.length(), phase: result.angle() };
    });

  // sort by amplitude
  if (sort) cycles = orderBy(cycles, (point) => point.amplitude, "desc");

  // only use first n epicycles
  cycles = cycles.slice(0, slice);

  return cycles;
};

// transform point
const transform = (point: Vector, size: number) => point.scale(size).toArray(2);
