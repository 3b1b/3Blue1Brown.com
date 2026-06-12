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
import { round, smoothstep } from "~/util/math";
import { formatNumber } from "~/util/string";
import { Vector } from "~/util/vector";
import {
  fitPoints,
  joinList,
  nearestPowerOfTwo,
  parseSvg,
  resamplePoints,
  smoothPoints,
  splitList,
} from "./computation";
import ComputationWorker from "./computation?worker";

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
  const [epicycleCount, setEpicycleCount] = useState(100);
  // zoom into tip
  const [zoom, setZoom] = useState(0);
  // animation speed
  const [speed, setSpeed] = useState(1);
  // trace decay time
  const [traceDecay, setTraceDecay] = useState(5);
  // which epicycle to follow with zoom and highlight
  const [highlight, setHighlight] = useState(-1);

  // parse out attribution from list text
  const attribution = useMemo(
    () => list.match(/^[\p{L} \-,]+$/mu)?.[0] ?? "",
    [list],
  );
  // parse out link from list text
  const link = useMemo(() => list.match(/^http.*$/m)?.[0] ?? "", [list]);

  // drawing mode
  const [drawing, setDrawing] = useState(false);

  // line widths
  const [shapeThickness, setShapeThickness] = useState(1);
  const [epicycleThickness, setEpicycleThickness] = useState(1);
  const [traceThickness, setTraceThickness] = useState(4);
  const [highlightThickness, setHighlightThickness] = useState(2);

  // colors
  const [shapeColor, setShapeColor] = useState("#503030");
  const [epicycleColor, setEpicycleColor] = useState("#ffffff");
  const [traceColor, setTraceColor] = useState("#51c9ff");
  const [highlightColor, setHighlightColor] = useState("#ffa44e");

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
  const time = useRef(0);

  // highlighted epicycle
  const highlighted =
    highlight !== -1 && highlight !== epicycles.length
      ? epicycles.at(highlight)
      : null;

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
        onPointerMove={({ currentTarget, clientX, clientY, buttons }) => {
          if (!drawing || !buttons) return;
          // record mouse position
          const { left, top, width, height } =
            currentTarget.getBoundingClientRect();
          const position = new Vector(
            clientX - left - width / 2,
            clientY - top - height / 2,
          );
          setList((list) => (list + "\n" + joinList([position])).trim());
        }}
        onPointerUp={() => {
          // stop drawing and process drawn points
          if (!drawing) return;
          setDrawing(false);
          let points = splitList(list);
          points = smoothPoints(points, 5);
          points = resamplePoints(points, 10000);
          setList(joinList(points));
        }}
        render={(ctx, { width, height }, delta) => {
          // canvas size, contain
          const size = Math.min(width, height) / 2 - 100;

          // drawing mode
          if (drawing) {
            // draw shape
            if (shapeThickness) {
              // styles
              ctx.fillStyle = shapeColor;
              ctx.strokeStyle = shapeColor;
              ctx.lineWidth = shapeThickness;

              // path
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
          time.current += (delta / 1000) * (speed / 10);

          // get epicycle segments
          let tip = new Vector();
          const segments = epicycles.map(({ frequency, amplitude, phase }) => {
            // go out one tip
            const to = tip.add(
              new Vector(amplitude, 0).rotate(
                phase + frequency * time.current * points.length,
              ),
            );
            const segment = { from: tip, to };
            tip = to;
            return segment;
          });

          // add last point to trace
          trace.current.unshift(tip);
          // limit trace length by time
          if (delta) trace.current.splice(traceDecay * (1000 / delta));

          // zoom center
          const center = segments.at(highlight)?.from ?? tip;

          // zoom translate
          const translate =
            center.scale(smoothstep(2 ** zoom - 1)) ?? new Vector();

          // zoom scale
          const scale = size * 2 ** zoom;

          // transform point
          const transform = (point: Vector) =>
            point.subtract(translate).scale(scale);

          // draw shape
          if (shapeThickness) {
            // styles
            ctx.fillStyle = shapeColor;
            ctx.strokeStyle = shapeColor;
            ctx.lineWidth = shapeThickness;

            // path
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
            // put highlighted segment at end so it's drawn on top
            segments.push(...segments.splice(highlight, 1));

            // height of arrow head relative to line thickness
            const arrowSize = 10;
            // arrow head flare angle
            const arrowAngle = 20;

            for (const [index, segment] of Object.entries(segments)) {
              // last segment highlighted
              const highlighted = Number(index) === segments.length - 1;

              // styles
              const color = highlighted ? highlightColor : epicycleColor;
              const thickness = highlighted
                ? highlightThickness
                : epicycleThickness;
              ctx.fillStyle = color;
              ctx.strokeStyle = color;
              ctx.lineWidth = thickness;

              // get points
              const from = transform(segment.from);
              const to = transform(segment.to);
              const fromTo = to.subtract(from);
              const length = fromTo.length();

              // don't draw beyond diminishing returns
              if (length < 1) continue;
              // arrow head
              const head = fromTo.length(arrowSize * thickness).clip(0, length);
              // head flares
              const left = to.add(head.rotate(180 + arrowAngle));
              const right = to.add(head.rotate(180 - arrowAngle));
              // bottom center of head
              const base = from.add(
                // retract shaft a bit so it doesn't overflow out of tip
                fromTo.extend(-head.length() / 2),
              );

              // stick
              ctx.beginPath();
              ctx.moveTo(...from.toArray(2));
              ctx.lineTo(...base.toArray(2));
              ctx.stroke();

              // arrow
              ctx.beginPath();
              ctx.moveTo(...left.toArray(2));
              ctx.lineTo(...to.toArray(2));
              ctx.lineTo(...right.toArray(2));
              ctx.fill();

              // circle
              ctx.globalAlpha = highlighted ? 1 : 0.25;
              ctx.beginPath();
              ctx.arc(...from.toArray(2), length, 0, 2 * Math.PI);
              ctx.stroke();

              // unset styles
              ctx.globalAlpha = 1;
            }
          }

          // draw trace
          if (traceThickness) {
            // styles
            ctx.fillStyle = traceColor;
            ctx.strokeStyle = traceColor;
            ctx.lineWidth = traceThickness;
            ctx.lineCap = "round";

            // path
            pairs(trace.current).forEach(([from, to], index) => {
              ctx.lineWidth =
                traceThickness * (1 - index / trace.current.length);
              ctx.beginPath();
              ctx.moveTo(...transform(from).toArray(2));
              ctx.lineTo(...transform(to).toArray(2));
              ctx.stroke();
            });

            // unset styles
            ctx.lineCap = "butt";
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
          <div className="flex w-80 flex-col gap-4">
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
              label={
                <>
                  Points{" "}
                  <span className="text-gray">
                    ({formatNumber(points.length, false)})
                  </span>
                </>
              }
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
                  if (!drawing) {
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
          <div className="grid w-full grid-cols-[auto_1fr] items-center gap-4 *:contents">
            <NumberBox
              label="Epicycles"
              value={epicycleCount}
              onChange={setEpicycleCount}
              min={1}
              max={nearestPowerOfTwo(points.length)}
              step={1}
            />
            <NumberBox
              label="Zoom"
              value={zoom}
              onChange={(zoom) => {
                setZoom(zoom);
                // link speed to zoom
                setSpeed(round(1 / (2 ** zoom) ** 0.5, 0.01, "ceil"));
              }}
              min={0}
              max={20}
              step={0.25}
            />
            <NumberBox
              label="Speed"
              value={speed}
              onChange={setSpeed}
              min={-10}
              max={10}
              step={0.25}
            />
            <NumberBox
              label="Trace"
              value={traceDecay}
              onChange={setTraceDecay}
              min={0}
              max={0}
              step={0.1}
            />
            <NumberBox
              label="Highlight"
              value={highlight}
              onChange={setHighlight}
              min={-epicycles.length}
              max={epicycles.length}
              step={1}
            />
          </div>

          <div />

          {highlighted && (
            <div className="grid grid-cols-[auto_auto] items-center gap-4">
              <strong className="col-span-full">
                Epicycle{" "}
                {highlight >= 0 ? highlight : epicycles.length + highlight}
              </strong>
              <span>Frequency</span>
              <span>{highlighted.frequency.toFixed(2)} Hz</span>
              <span>Amplitude</span>
              <span>
                {(highlighted.amplitude * 100).toFixed(
                  Math.floor(5 / (100 * highlighted.amplitude + 1)),
                )}
                %
              </span>
              <span>Phase</span>
              <span>{highlighted.phase.toFixed(0)}°</span>
            </div>
          )}
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
          <div className="grid grid-cols-[auto_auto_auto] items-center gap-4">
            <div />
            <div>Thickness</div>
            <div>Color</div>

            <div>Shape</div>
            <NumberBox
              aria-label="Shape Thickness"
              value={shapeThickness}
              onChange={setShapeThickness}
              min={0}
              max={10}
              step={0.25}
            />
            <ColorSelect
              className="justify-self-center"
              aria-label="Shape Color"
              value={shapeColor}
              onChange={setShapeColor}
            />

            <div>Epicycles</div>
            <NumberBox
              aria-label="Epicycle Thickness"
              value={epicycleThickness}
              onChange={setEpicycleThickness}
              min={0}
              max={10}
              step={0.25}
            />
            <ColorSelect
              className="justify-self-center"
              aria-label="Epicycle Color"
              value={epicycleColor}
              onChange={setEpicycleColor}
            />

            <div>Trace</div>
            <NumberBox
              aria-label="Trace Thickness"
              value={traceThickness}
              onChange={setTraceThickness}
              min={0}
              max={10}
              step={0.25}
            />
            <ColorSelect
              className="justify-self-center"
              aria-label="Trace Color"
              value={traceColor}
              onChange={setTraceColor}
            />

            <div>Highlight</div>
            <NumberBox
              aria-label="Highlight Thickness"
              value={highlightThickness}
              onChange={setHighlightThickness}
              min={0}
              max={10}
              step={0.25}
            />
            <ColorSelect
              className="justify-self-center"
              aria-label="Highlight Color"
              value={highlightColor}
              onChange={setHighlightColor}
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
