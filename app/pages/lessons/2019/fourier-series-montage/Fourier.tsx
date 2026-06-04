import { useEffect, useMemo, useRef, useState } from "react";
import { GearIcon } from "@phosphor-icons/react";
import { pairs } from "d3";
import { orderBy, range, startCase } from "lodash-es";
import Button from "~/components/Button";
import Canvas from "~/components/Canvas";
import { ColorSelect } from "~/components/ColorSelect";
import NumberBox from "~/components/NumberBox";
import Select from "~/components/Select";
import Tooltip from "~/components/Tooltip";
import { Vector } from "~/util/vector";
import shapes from "./shapes.json";

export default function Fourier() {
  // shape to draw
  const [shape, setShape] = useState("pi");
  // how many points to sample from shape
  const [pointCount, setPointCount] = useState(500);
  // how many epicycles to use
  const [epicycleCount, setEpicycleCount] = useState(50);
  // trace length
  const [traceLength, setTraceLength] = useState(1000);
  // animation speed
  const [speed, setSpeed] = useState(10);
  // zoom into tip
  const [zoom, setZoom] = useState(1);

  // colors
  const [shapeColor, setShapeColor] = useState("#fa8072");
  const [epicycleColor, setEpicycleColor] = useState("#ffffff");
  const [traceColor, setTraceColor] = useState("#51c9ff");

  // line widths
  const [shapeThickness, setShapeThickness] = useState(1);
  const [epicycleThickness, setEpicycleThickness] = useState(1);
  const [traceThickness, setTraceThickness] = useState(4);

  // points sampled from shape
  const points = useMemo(
    () => getPoints(shapes[shape as keyof typeof shapes] ?? "", pointCount),
    [shape, pointCount],
  );

  // epicycles that reconstruct shape
  const epicycles = useMemo(
    () => getEpicycles(points, epicycleCount),
    [points, epicycleCount],
  );

  console.log(points);

  // trail of points left by tip of epicycles
  const trace = useRef<Vector[]>([]);

  // clear trace on certain changes
  useEffect(() => {
    trace.current = [];
  }, [shape]);
  useEffect(() => {
    if (pointCount < 20) trace.current = [];
  }, [pointCount]);
  useEffect(() => {
    if (epicycleCount < 20) trace.current = [];
  }, [epicycleCount]);

  // animation time
  const _time = useRef(0);

  return (
    <>
      <Canvas
        className="absolute inset-0 -z-10 size-full"
        render={(ctx, width, height, delta) => {
          const time = (_time.current += (delta / 1000) * (speed / 100));

          // canvas size, contain
          const size = Math.min(width, height) / 4;

          // draw shape
          if (shapeThickness) {
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
          if (epicycleThickness) {
            ctx.strokeStyle = epicycleColor;
            ctx.lineWidth = epicycleThickness;
            let from = new Vector();
            for (const { frequency, amplitude, phase } of epicycles) {
              const to = from.add(
                new Vector(amplitude, 0).rotate(
                  phase + frequency * time * pointCount,
                ),
              );
              const _from = transform(from, size);
              const _to = transform(to, size);
              const _dist = transform(to.subtract(from), size);
              ctx.globalAlpha = 0.75;
              ctx.beginPath();
              ctx.moveTo(..._from);
              ctx.lineTo(..._to);
              ctx.stroke();
              ctx.globalAlpha = 0.25;
              ctx.beginPath();
              ctx.arc(..._from, Math.hypot(..._dist), 0, 2 * Math.PI);
              ctx.stroke();
              from = to;
            }

            // add last point to trace
            trace.current.unshift(from);
            // limit trace length
            trace.current.splice(traceLength);
          }

          // draw trace
          if (traceThickness) {
            ctx.strokeStyle = traceColor;
            ctx.globalAlpha = 1;
            pairs(trace.current).forEach(([from, to], index) => {
              ctx.lineWidth =
                traceThickness * (1 - index / trace.current.length);
              ctx.beginPath();
              ctx.moveTo(...transform(from, size));
              ctx.lineTo(...transform(to, size));
              ctx.stroke();
            });
          }
        }}
      />

      {/* controls */}
      <Tooltip
        hover={false}
        trigger={
          <Button className="absolute top-4 left-4 z-10">
            <GearIcon />
            Settings
          </Button>
        }
      >
        <div className="grid grid-cols-[max-content_auto] items-center gap-x-8 gap-y-4 p-4 [&_label]:contents">
          <Select
            label="Shape"
            value={shape}
            onChange={setShape}
            options={Object.keys(shapes).map((key) => ({
              value: key,
              label: startCase(key),
            }))}
          />
          <NumberBox
            label="Points"
            value={pointCount}
            onChange={setPointCount}
            min={10}
            max={1000}
            step={10}
          />
          <NumberBox
            label="Epicycles"
            value={epicycleCount}
            onChange={setEpicycleCount}
            min={1}
            max={1000}
            step={1}
          />
          <NumberBox
            label="Trace"
            value={traceLength}
            onChange={setTraceLength}
            min={0}
            max={10000}
            step={100}
          />
          <NumberBox
            label="Speed"
            value={speed}
            onChange={setSpeed}
            min={0}
            max={100}
            step={1}
          />
          <NumberBox
            label="Zoom"
            value={zoom}
            onChange={setZoom}
            min={0.1}
            max={10}
            step={0.1}
          />

          <NumberBox
            label="Shape Thickness"
            value={shapeThickness}
            onChange={setShapeThickness}
            min={0}
            max={10}
            step={0.5}
          />
          <ColorSelect
            label="Shape Color"
            value={shapeColor}
            onChange={setShapeColor}
          />
          <NumberBox
            label="Epicycle Thickness"
            value={epicycleThickness}
            onChange={setEpicycleThickness}
            min={0}
            max={10}
            step={0.5}
          />
          <ColorSelect
            label="Epicycle Color"
            value={epicycleColor}
            onChange={setEpicycleColor}
          />
          <NumberBox
            label="Trace Thickness"
            value={traceThickness}
            onChange={setTraceThickness}
            min={0}
            max={10}
            step={0.5}
          />
          <ColorSelect
            label="Trace Color"
            value={traceColor}
            onChange={setTraceColor}
          />
        </div>
      </Tooltip>
    </>
  );
}

// transform point
const transform = (point: Vector, size: number) => point.scale(size).toArray(2);

// convert svg path to list of points in [-1,1]
export const getPoints = (
  d: string,
  count: number,
  scale: "contain" | "cover" | "stretch" = "contain",
) => {
  // make svg element
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);

  // sample points along path
  const length = path.getTotalLength();
  const points = range(count).map((index) =>
    Vector.fromObject(path.getPointAtLength(length * (index / count))),
  );

  // stretch to fit [-1,1], without preserving aspect ratio
  if (scale === "stretch") return Vector.fit(points);

  // cover/contain to fit in [-1,1], while preserving aspect ratio
  const min = Vector.min(points);
  const max = Vector.max(points);
  const width = max.x - min.x;
  const height = max.y - min.y;
  const shorter = Math.min(width, height);
  const longer = Math.max(width, height);
  const multiply = new Vector(
    (scale === "cover" ? longer : shorter) / height,
    (scale === "cover" ? longer : shorter) / width,
  );
  return Vector.fit(points).map((point) => point.multiply(multiply));
};

// discrete fourier transform to get epicycles that reconstruct points
// https://www.jezzamon.com/fourier/
// https://dsp.stackexchange.com/questions/59068/how-to-get-fourier-coefficients-to-draw-any-shape-using-dft
const getEpicycles = (points: Vector[], cycleCount: number) => {
  let epicycles = range(-points.length / 2, points.length / 2)
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
  epicycles = orderBy(epicycles, (point) => point.amplitude, "desc");

  // only use first, most impactful epicycles
  epicycles = epicycles.slice(0, cycleCount);

  return epicycles;
};
