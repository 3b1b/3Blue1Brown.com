import type { Dispatch, SetStateAction } from "react";
import type { Props as ShaderProps } from "~/components/Shader";
import { useRef, useState } from "react";
import { useElementSize, useResizeObserver } from "@reactuses/core";
import clsx from "clsx";
import { interpolateViridis } from "d3";
import { range } from "d3-array";
import { axisBottom, axisRight } from "d3-axis";
import { scaleLinear } from "d3-scale";
import { select } from "d3-selection";
import { zoom, zoomIdentity } from "d3-zoom";
import Button from "~/components/Button";
import NumberBox from "~/components/NumberBox";
import Shader, { normalizeColor } from "~/components/Shader";
import { Complex, getCoefficients } from "~/util/complex";
import { useUA } from "~/util/hooks";
import { round } from "~/util/math";
import source from "./newtons-fractal.frag?raw";

const defaultPoints = [
  { x: -1.33, y: 0.0, color: "#000000" },
  { x: 0.0, y: -1.0, color: "#000000" },
  { x: 0.0, y: 1.0, color: "#000000" },
  { x: 0.66, y: -0.5, color: "#000000" },
  { x: 0.66, y: 0.5, color: "#000000" },
  { x: -0.66, y: -0.5, color: "#000000" },
  { x: -0.66, y: 0.5, color: "#000000" },
  { x: 1.33, y: 0.0, color: "#000000" },
  { x: 0, y: 0.0, color: "#000000" },
];

const defaultCount = 5;

const defaultIterations = 10;

const defaultTransform = zoomIdentity;

export default function NewtonsFractal() {
  // input points (roots and colors)
  const [_points, setPoints] = useState(defaultPoints);
  // number of roots to show
  const [count, setCount] = useState(defaultCount);
  // slice of input points to show
  const points = _points.slice(0, count).map((point, index, array) => ({
    ...point,
    color: interpolateViridis(index / array.length),
  }));

  // coefficients of expanded polynomial from roots
  const coefs = getCoefficients(points.map(({ x, y }) => new Complex(x, y)));

  // newton's method parameters
  const [iterations, setIterations] = useState(defaultIterations);

  return (
    <div className="flex size-full flex-col">
      <Chart
        source={source}
        constants={{
          DEGREE: points.length,
          ITERATIONS: iterations,
          THRESHOLD: "0.0001f",
        }}
        uniforms={{
          // set roots
          ...Object.fromEntries(
            points.map(({ x, y }, index) => [`roots[${index}]`, [x, y]]),
          ),

          // set colors
          ...Object.fromEntries(
            points.map(({ color }, index) => [
              `colors[${index}]`,
              normalizeColor(color),
            ]),
          ),

          // set coefs
          ...Object.fromEntries(
            coefs
              .toReversed()
              .map(({ r, i }, index) => [`coefs[${index}]`, [r, i]]),
          ),
        }}
        points={points}
        setPoints={setPoints}
      />
      {/* visualization controls */}
      <div className="flex items-end gap-4 p-4">
        <NumberBox
          label="Iterations"
          value={iterations}
          onChange={setIterations}
          min={0}
          max={20}
        />
        <NumberBox
          label="Roots"
          value={count}
          onChange={setCount}
          min={1}
          max={9}
        />
        <Button
          color="theme"
          onClick={() => {
            setPoints(structuredClone(defaultPoints));
            setCount(defaultCount);
            setIterations(defaultIterations);
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}

type Point = {
  x: number;
  y: number;
  color: string;
};

type ChartProps = {
  // base zoom level (view extent starts at -/+ this)
  scale?: number;
  // list of points
  points?: Point[];
  // update points
  setPoints?: Dispatch<SetStateAction<Point[]>>;
} & Partial<ShaderProps>;

// shader underlay and svg overlay w/ axes, zoom/pan, draggable points
export function Chart({
  source = "",
  constants = {},
  uniforms = {},
  scale = 2,
  points = [],
  setPoints = () => {},
  className = "",
}: ChartProps) {
  const ref = useRef<HTMLDivElement>(null);
  const gridRef = useRef<SVGGElement>(null);

  // size of main visualization area
  let [width, height] = useElementSize(ref);
  width ||= 100;
  height ||= 100;

  // zoom/pan transform matrix
  const [transform, setTransform] = useState(defaultTransform);

  // smaller of sides
  const side = Math.min(width, height);
  const xDomain = scale * (width / side);
  const yDomain = scale * (height / side);

  // map input x coord to screen x coord
  let xScale = scaleLinear().domain([-xDomain, xDomain]).range([0, width]);
  // map input y coord to screen y coord
  let yScale = scaleLinear().domain([-yDomain, yDomain]).range([0, height]);

  // account for zoom/pan transform in x scale
  xScale = transform.rescaleX(xScale);
  // account for zoom/pan transform in y scale
  yScale = transform.rescaleY(yScale);

  // bounds of view, in input coords
  const [left = 0, right = 0] = xScale.domain();
  const [top = 0, bottom = 0] = yScale.domain();

  // spacing between ticks, proportional to zoom level
  let spacing = 10 / transform.k;

  // round spacing
  spacing = 10 ** (round(Math.log10(spacing), 0.25) - 1);

  // starting/ending ticks
  const leftTick = round(left, spacing, "floor");
  const rightTick = round(right, spacing, "ceil");
  const topTick = round(top, spacing, "floor");
  const bottomTick = round(bottom, spacing, "ceil");

  // evenly spaced x ticks
  const xTicks = range(leftTick, rightTick + spacing, spacing);
  // evenly spaced y ticks
  const yTicks = range(topTick, bottomTick + spacing, spacing);

  // x axis renderer
  const xAxis = axisBottom(xScale)
    .tickValues(xTicks)
    .tickSize(height)
    .tickFormat((value) => Number(value).toFixed(2))
    .tickPadding(-20);

  // y axis renderer
  const yAxis = axisRight(yScale)
    .tickValues(yTicks)
    .tickSize(width)
    .tickFormat((value) => (-Number(value)).toFixed(2) + "i")
    .tickPadding(-5);

  // zoom/pan behavior
  const zoomBehavior = zoom<SVGGElement, unknown>()
    .scaleExtent([0.1, 100000])
    .on("zoom", ({ transform }) => setTransform(transform));

  // reset zoom/pan
  const resetZoom = () => setTransform(defaultTransform);

  // reset zoom/pan on resize
  useResizeObserver(ref, resetZoom);

  // radius of points, roughly as % of view size
  let pointSize = 0.05;
  if (!useUA().isDesktop) pointSize = 0.1;

  // radius of points, scaled to constant size in screen coords
  const radius = (scale * (xScale(pointSize) - xScale(0))) / transform.k;

  return (
    <div
      ref={ref}
      className={clsx(
        "relative size-full touch-none overflow-clip border select-none",
        className,
      )}
    >
      {/* shader underlay */}
      <Shader
        className="size-full"
        source={source}
        constants={constants}
        uniforms={{
          ...uniforms,
          // set bounds
          bounds: [left, top, right, bottom],
        }}
      />

      {/* svg overlay */}
      <svg
        viewBox={[0, 0, width, height].join(" ")}
        className="absolute inset-0 size-full text-white"
      >
        {/* grid lines */}
        <g
          pointerEvents="all"
          className="cursor-grab stroke-[0.25]"
          ref={(element) => {
            gridRef.current = element;
            if (!element) return;
            const selection = select(element);
            // attach zoom to element
            zoomBehavior(selection);
            // update zoom transform
            zoomBehavior.transform(selection, transform);
            // reset zoom on double click
            selection.on("dblclick.zoom", resetZoom);
          }}
        >
          {/* x-axis */}
          <g
            ref={(element) => {
              if (!element) return;
              // attach axis to element
              xAxis(select(element));
              // remove interfering d3 axis styles
              element.removeAttribute("font-size");
              element.removeAttribute("font-family");
            }}
            className="text-shadow-sm/100"
          />

          {/* y-axis */}
          <g
            ref={(element) => {
              if (!element) return;
              // attach axis to element
              yAxis(select(element));
              // remove interfering d3 axis styles
              element.removeAttribute("font-size");
              element.removeAttribute("font-family");
              // align
              element.setAttribute("text-anchor", "end");
            }}
            className="text-shadow-sm/100"
          />
        </g>

        {/* points */}
        {points.map(({ x, y, color }, index) => (
          <circle
            key={index}
            onPointerDown={(event) => {
              // mark this element as one being dragged
              event.currentTarget.setPointerCapture(event.pointerId);
              // stop zoom/pan from also triggering
              event.stopPropagation();
            }}
            onPointerMove={(event) => {
              // if this element not one being dragged, ignore
              if (!event.currentTarget.hasPointerCapture(event.pointerId))
                return;
              event.preventDefault();
              const svg = event.currentTarget.ownerSVGElement;
              if (!svg) return;
              // convert page coords to svg coords
              let point = svg.createSVGPoint();
              point.x = event.clientX;
              point.y = event.clientY;
              point = point.matrixTransform(svg.getScreenCTM()?.inverse());
              // update point
              setPoints((points) => {
                const newPoints = structuredClone(points);
                const newPoint = newPoints[index];
                if (newPoint) {
                  newPoint.x = xScale.invert(point.x);
                  newPoint.y = yScale.invert(point.y);
                }
                return newPoints;
              });
            }}
            onPointerUp={(event) =>
              // clear this element as one being dragged
              event.currentTarget.releasePointerCapture(event.pointerId)
            }
            cx={xScale(x)}
            cy={yScale(y)}
            r={radius}
            fill={color}
            stroke="white"
            strokeWidth={radius / 5}
            className="cursor-crosshair touch-none"
          />
        ))}
      </svg>
    </div>
  );
}
