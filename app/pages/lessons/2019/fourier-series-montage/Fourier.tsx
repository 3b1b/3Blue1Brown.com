import { useMemo, useRef, useState } from "react";
import { CompassToolIcon, PaintBrushIcon } from "@phosphor-icons/react";
import { pairs } from "d3";
import { startCase } from "lodash-es";
import Button from "~/components/Button";
import Canvas from "~/components/Canvas";
import { ColorSelect } from "~/components/ColorSelect";
import NumberBox from "~/components/NumberBox";
import Select from "~/components/Select";
import Tooltip from "~/components/Tooltip";
import { importAssets } from "~/util/import";
import { smoothstep } from "~/util/math";
import { Vector } from "~/util/vector";
import { useComputation } from "./hooks";

// import all shapes
const [getShape, shapes] = importAssets(
  import.meta.glob<string>("./*.txt", { eager: true, as: "raw" }),
);

export default function Fourier() {
  // shape to draw
  const [shape, setShape] = useState("pi");
  // how many epicycles to use
  const [epicycleCount, setEpicycleCount] = useState(500);
  // trace length
  const [traceLength, setTraceLength] = useState(500);
  // animation speed
  const [speed, setSpeed] = useState(100);
  // zoom into tip
  const [zoom, setZoom] = useState(0);

  // colors
  const [shapeColor, setShapeColor] = useState("#fa8072");
  const [epicycleColor, setEpicycleColor] = useState("#ffffff");
  const [traceColor, setTraceColor] = useState("#51c9ff");

  // line widths
  const [shapeThickness, setShapeThickness] = useState(1);
  const [epicycleThickness, setEpicycleThickness] = useState(1);
  const [traceThickness, setTraceThickness] = useState(4);

  // points sampled from shape
  const points = useMemo(() => {
    return (
      getShape(shape)
        ?.split("\n")
        .map((line) => {
          const [x, y] = line.split("\t");
          if (!x || !y) return;
          return new Vector(Number(x), Number(y));
        })
        ?.filter((point) => !!point) ?? []
    );
  }, [shape]);

  // compute epicycles
  const epicycles = useComputation(points, epicycleCount);

  // trail of points left by tip of epicycles
  const trace = useRef<Vector[]>([]);

  // animation time
  const _time = useRef(0);

  return (
    <>
      <Canvas
        className="absolute inset-0 -z-10 size-full"
        render={(ctx, width, height, delta) => {
          // advance time
          const time = (_time.current += (delta / 1000) * (speed / 1000));

          // canvas size, contain
          const size = Math.min(width, height) / 4;

          // get epicycle segments
          let from = new Vector();
          const segments = epicycles.map(({ frequency, amplitude, phase }) => {
            // go out one tip
            const to = from.add(
              new Vector(amplitude, 0).rotate(
                phase + frequency * time * points.length,
              ),
            );
            const segment = { from, to };
            from = to;
            return segment;
          });

          // add last point to trace
          trace.current.unshift(from);
          // limit trace length
          trace.current.splice(traceLength);

          // zoom center
          const center = trace.current[0] ?? new Vector();

          // draw shape
          if (shapeThickness) {
            ctx.strokeStyle = shapeColor;
            ctx.lineWidth = shapeThickness;
            ctx.lineCap = "butt";
            ctx.globalAlpha = 0.5;
            const [first, ...rest] = points;
            ctx.beginPath();
            ctx.moveTo(...transform(first!, size, center, zoom).toArray(2));
            for (const point of rest)
              ctx.lineTo(...transform(point, size, center, zoom).toArray(2));
            ctx.closePath();
            ctx.stroke();
          }

          // draw epicycles
          if (epicycleThickness) {
            ctx.strokeStyle = epicycleColor;
            ctx.lineWidth = epicycleThickness;
            ctx.lineCap = "butt";
            for (const { from, to } of segments) {
              const _from = transform(from, size, center, zoom);
              const _to = transform(to, size, center, zoom);
              const _dist = _to.subtract(_from).length();
              ctx.globalAlpha = 0.75;
              ctx.beginPath();
              ctx.moveTo(..._from.toArray(2));
              ctx.lineTo(..._to.toArray(2));
              ctx.stroke();
              ctx.globalAlpha = 0.25;
              ctx.beginPath();
              ctx.arc(..._from.toArray(2), _dist, 0, 2 * Math.PI);
              ctx.stroke();
            }
          }

          // draw trace
          if (traceThickness) {
            ctx.strokeStyle = traceColor;
            ctx.lineCap = "round";
            ctx.globalAlpha = 1;
            pairs(trace.current).forEach(([from, to], index) => {
              ctx.lineWidth =
                traceThickness * (1 - index / trace.current.length);
              ctx.beginPath();
              ctx.moveTo(...transform(from, size, center, zoom).toArray(2));
              ctx.lineTo(...transform(to, size, center, zoom).toArray(2));
              ctx.stroke();
            });
          }
        }}
      />

      {/* controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-4">
        <Tooltip
          hover={false}
          trigger={
            <Button>
              <CompassToolIcon />
              Params
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
              max={1000}
              step={1}
            />
            <NumberBox
              label="Zoom"
              value={zoom}
              onChange={setZoom}
              min={0}
              max={20}
              step={0.25}
            />
          </div>
        </Tooltip>

        <Tooltip
          hover={false}
          trigger={
            <Button>
              <PaintBrushIcon />
              Styles
            </Button>
          }
        >
          <div className="grid grid-cols-[max-content_auto] items-center gap-x-8 gap-y-4 p-4 [&_label]:contents">
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
      </div>
    </>
  );
}

// transform point
const transform = (
  point: Vector,
  size: number,
  center: Vector,
  zoom: number,
) => {
  zoom = 2 ** zoom;
  return point.subtract(center.scale(smoothstep(zoom - 1))).scale(size * zoom);
};
