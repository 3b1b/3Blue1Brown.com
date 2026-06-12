import type { Remote } from "comlink";
import type * as ComputationAPI from "./computation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CompassToolIcon,
  PaintBrushIcon,
  PencilIcon,
  TriangleIcon,
} from "@phosphor-icons/react";
import clsx from "clsx";
import { pairs } from "d3";
import { clamp, startCase } from "lodash-es";
import Button from "~/components/Button";
import Canvas from "~/components/Canvas";
import { ColorSelect } from "~/components/ColorSelect";
import Link from "~/components/Link";
import NumberBox from "~/components/NumberBox";
import Select from "~/components/Select";
import TextBox from "~/components/TextBox";
import Tooltip from "~/components/Tooltip";
import Upload from "~/components/Upload";
import { useWorker } from "~/util/hooks";
import { importAssets } from "~/util/import";
import { smoothstep } from "~/util/math";
import { Vector } from "~/util/vector";
import {
  fitPoints,
  joinList,
  parseSvg,
  resamplePoints,
  smoothPoints,
  splitList,
} from "./computation";
import ComputationWorker from "./computation?worker";

// origin line lengths
const originSize = 10;
// height of arrow head relative to line thickness
const arrowSize = 6;
// arrow head flare angle
const arrowAngle = 20;

// import all shapes
const [getShape, shapes] = importAssets(
  import.meta.glob<{ default: string }>("./shapes/*.txt", {
    eager: true,
    query: "raw",
  }),
  undefined,
  (module) => module.default,
);

export default function Fourier() {
  // text list of coordinates in shape
  const [list, setList] = useState(getShape("pi") ?? "");
  // how many epicycles to use
  const [epicycleCount, setEpicycleCount] = useState(1000);
  // zoom into tip
  const [_zoom, setZoom] = useState(0);
  // animation speed
  const [speed, setSpeed] = useState(100);
  // trace length
  const [traceLength, setTraceLength] = useState(500);

  // parse out attribution from list text
  const attribution = useMemo(
    () => list.match(/^[\p{L} \-,]+$/mu)?.[0] ?? "",
    [list],
  );
  // parse out link from list text
  const link = useMemo(() => list.match(/^http.*$/m)?.[0] ?? "", [list]);

  // drawing mode
  const [drawing, setDrawing] = useState(false);

  // colors
  const [shapeColor, setShapeColor] = useState("#fa8072");
  const [epicycleColor, setEpicycleColor] = useState("#ffffff");
  const [traceColor, setTraceColor] = useState("#51c9ff");

  // line widths
  const [shapeThickness, setShapeThickness] = useState(2);
  const [epicycleThickness, setEpicycleThickness] = useState(1);
  const [traceThickness, setTraceThickness] = useState(4);

  // convert list to points
  const rawPoints = useMemo(() => splitList(list), [list]);
  // fit points to [-1,1]
  const points = useMemo(() => fitPoints(rawPoints), [rawPoints]);

  // compute epicycles
  const [epicycles = [], computing] = useWorker(
    ComputationWorker,
    useCallback(
      (worker: Remote<typeof ComputationAPI>) =>
        worker.compute(points, epicycleCount),
      [points, epicycleCount],
    ),
  );

  // trail of points left by tip of epicycles
  const trace = useRef<Vector[]>([]);

  // reset trace under certain conditions
  useEffect(() => {
    trace.current = [];
  }, [epicycles]);

  // animation time
  const _time = useRef(0);

  // power zoom
  const zoom = 2 ** _zoom;

  // stop drawing and process drawn points
  const stopDrawing = () => {
    if (!drawing) return;
    setDrawing(false);
    let points = splitList(list);
    points = smoothPoints(points, 5);
    points = resamplePoints(points, 2000);
    setList(joinList(points));
  };

  return (
    <>
      {computing && !drawing && (
        <div className="absolute inset-0 grid place-items-center text-2xl">
          Computing...
        </div>
      )}
      <Canvas
        className={clsx(
          "absolute inset-0 -z-10 size-full",
          drawing && "cursor-crosshair",
        )}
        onPointerUp={stopDrawing}
        render={(ctx, { width, height }, delta, { position, pressed }) => {
          // return;
          // canvas size, contain
          const size = Math.min(width, height) / 3;

          // drawing mode
          if (drawing) {
            if (pressed)
              setList((list) => (list + "\n" + joinList([position])).trim());

            // draw shape
            if (shapeThickness) {
              ctx.strokeStyle = shapeColor;
              ctx.lineWidth = shapeThickness;
              ctx.lineCap = "butt";
              ctx.globalAlpha = 0.5;
              const [first, ...rest] = rawPoints;
              if (first && rest.length) {
                ctx.beginPath();
                ctx.moveTo(...first.toArray(2));
                for (const point of rest) ctx.lineTo(...point.toArray(2));
                ctx.closePath();
                ctx.stroke();
              }
            }

            return;
          }

          // advance time
          const time = (_time.current +=
            ((delta / 1000) * (speed / 1000)) / zoom ** 0.5);

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
          const translate = from.scale(smoothstep(zoom - 1));

          // zoom scale
          const scale = size * zoom;

          // transform point
          const transform = (point: Vector) =>
            point.subtract(translate).scale(scale);

          // draw shape
          if (shapeThickness) {
            ctx.strokeStyle = shapeColor;
            ctx.lineWidth = shapeThickness;
            ctx.lineCap = "butt";
            ctx.globalAlpha = 0.5;
            const [first, ...rest] = points;
            if (first && rest.length) {
              ctx.beginPath();
              ctx.moveTo(...transform(first).toArray(2));
              for (const point of rest)
                ctx.lineTo(...transform(point).toArray(2));
              ctx.closePath();
              ctx.stroke();
            }
          }

          // draw epicycles
          if (epicycleThickness) {
            ctx.fillStyle = epicycleColor;
            ctx.strokeStyle = epicycleColor;
            ctx.lineWidth = epicycleThickness;
            ctx.lineCap = "butt";

            // origin
            {
              const leg = originSize / scale;
              ctx.beginPath();
              ctx.moveTo(...transform(new Vector(leg, 0)).toArray(2));
              ctx.lineTo(...transform(new Vector(-leg, 0)).toArray(2));
              ctx.moveTo(...transform(new Vector(0, leg)).toArray(2));
              ctx.lineTo(...transform(new Vector(0, -leg)).toArray(2));
              ctx.stroke();
            }

            for (const segment of segments) {
              const from = transform(segment.from);
              const to = transform(segment.to);
              const fromTo = to.subtract(from);
              const length = fromTo.length();
              // don't draw beyond diminishing returns
              if (length < 1) break;
              // arrow head
              const head = fromTo.length(arrowSize * epicycleThickness);
              // head flares
              const left = to.add(head.rotate(180 + arrowAngle));
              const right = to.add(head.rotate(180 - arrowAngle));
              // bottom center of head
              const base = from.add(
                // pull back a bit so shaft doesn't overflow out of arrow tip
                fromTo.extend(-(arrowSize * epicycleThickness) / 2),
              );
              // stick
              ctx.globalAlpha = 1;
              ctx.beginPath();
              ctx.moveTo(...from.toArray(2));
              ctx.lineTo(...base.toArray(2));
              ctx.stroke();
              // arrow
              ctx.globalAlpha = 1;
              ctx.beginPath();
              ctx.moveTo(...left.toArray(2));
              ctx.lineTo(...to.toArray(2));
              ctx.lineTo(...right.toArray(2));
              ctx.fill();
              // circle
              ctx.globalAlpha = 0.25;
              ctx.beginPath();
              ctx.arc(...from.toArray(2), length, 0, 2 * Math.PI);
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
              ctx.moveTo(...transform(from).toArray(2));
              ctx.lineTo(...transform(to).toArray(2));
              ctx.stroke();
            });
          }
        }}
      />

      {/* controls */}
      <div className="absolute top-4 left-4 z-10 flex flex-col items-start gap-4">
        {/* points */}
        <Tooltip
          hover={false}
          trigger={
            <Button>
              <TriangleIcon />
              Shape
            </Button>
          }
        >
          <div className="flex w-80 flex-col gap-4 p-4">
            <Select
              label="Shape"
              value={
                Object.keys(shapes).find((key) => shapes[key] === list) ??
                "custom"
              }
              onChange={(value) => {
                setList(getShape(value) ?? "");
              }}
              options={Object.keys(shapes)
                .map((key) => ({ value: key, label: startCase(key) }))
                .concat({ value: "custom", label: "Custom..." })}
            />
            <TextBox
              label="Points"
              multi
              value={list}
              onChange={setList}
              rows={5}
            />
            <div className="grid grid-cols-2 gap-4">
              <Upload
                color="light"
                accept={[
                  ".txt",
                  "text/plain",
                  ".svg",
                  "image/svg+xml",
                  ".csv",
                  "text/csv",
                  ".tsv",
                  "text/tab-separated-values",
                ]}
                onUpload={async (file) => {
                  const text = await file.text();
                  // text file
                  if (file.type === "text/plain") setList(text);

                  // svg
                  if (file.type === "image/svg+xml") {
                    const answer = window.prompt("Sample points", "1000");
                    if (!answer) return;
                    const count = clamp(Number(answer), 1, 50000);
                    const list = parseSvg(text, count) ?? "";
                    setList(list);
                  }
                }}
              >
                Upload
              </Upload>
              <Button
                color="light"
                onClick={() => {
                  if (drawing) stopDrawing();
                  else {
                    setList("");
                    setDrawing(true);
                  }
                }}
              >
                <PencilIcon />
                {drawing ? "Stop" : "Draw"}
              </Button>
            </div>
          </div>
        </Tooltip>

        {/* params */}
        <Tooltip
          hover={false}
          trigger={
            <Button>
              <CompassToolIcon />
              Params
            </Button>
          }
        >
          <div className="grid grid-cols-[max-content_auto] items-center gap-4 p-4 [&_label]:contents">
            <NumberBox
              label="Epicycles"
              value={epicycleCount}
              onChange={setEpicycleCount}
              min={1}
              max={10000}
              step={1}
            />
            <NumberBox
              label="Zoom"
              value={_zoom}
              onChange={setZoom}
              min={0}
              max={50}
              step={0.1}
            />
            <NumberBox
              label="Speed"
              value={speed}
              onChange={setSpeed}
              min={-1000}
              max={1000}
              step={1}
            />
            <NumberBox
              label="Trace"
              value={traceLength}
              onChange={setTraceLength}
              min={0}
              max={10000}
              step={10}
            />
          </div>
        </Tooltip>

        {/* styles */}
        <Tooltip
          hover={false}
          trigger={
            <Button>
              <PaintBrushIcon />
              Styles
            </Button>
          }
        >
          <div className="grid grid-flow-col grid-rows-[repeat(6,auto)] items-center gap-x-8 gap-y-4 p-4 [&_label]:contents">
            <NumberBox
              label="Shape Thickness"
              value={shapeThickness}
              onChange={setShapeThickness}
              min={0}
              max={20}
              step={0.1}
            />
            <NumberBox
              label="Epicycle Thickness"
              value={epicycleThickness}
              onChange={setEpicycleThickness}
              min={0}
              max={20}
              step={0.1}
            />
            <NumberBox
              label="Trace Thickness"
              value={traceThickness}
              onChange={setTraceThickness}
              min={0}
              max={20}
              step={0.1}
            />

            <ColorSelect
              label="Shape Color"
              value={shapeColor}
              onChange={setShapeColor}
            />
            <ColorSelect
              label="Epicycle Color"
              value={epicycleColor}
              onChange={setEpicycleColor}
            />
            <ColorSelect
              label="Trace Color"
              value={traceColor}
              onChange={setTraceColor}
            />
          </div>
        </Tooltip>
      </div>

      {/* attribution */}
      {(attribution || link) && (
        <div className="absolute top-4 right-4 z-10">
          {attribution ? (
            <>
              Credit: <Link to={link}>{attribution}</Link>
            </>
          ) : (
            <Link to={link}>Credit</Link>
          )}
        </div>
      )}
    </>
  );
}
