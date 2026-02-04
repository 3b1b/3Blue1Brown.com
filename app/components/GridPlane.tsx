import { Fragment } from "react";
import clsx from "clsx";
import classes from "./GridPlane.module.css";

// number of cells in each direction
const cells = 6 * 4;
// every nth line is major
const major = 4;
// size of each cell in svg units
const size = 100;
// how much to stagger line animations
const stagger = 0.1;

// grid edge from center
const radius = cells * size;

// intervals in each direction
const intervals = Array(cells * 2 + 1)
  .fill(0)
  .map((_, index) => -cells * size + index * size);

// minor lines
const minorLines = intervals.map((point, index) => ({
  horizontal: { x1: -radius, x2: radius, y1: point, y2: point },
  vertical: { x1: point, x2: point, y1: -radius, y2: radius },
  index,
}));

// major lines
const majorLines = minorLines.filter((_, index) => index % major === 0);

// group lines into layers
const layers = [
  {
    lines: minorLines,
    className: "stroke-2 stroke-light-gray [stroke-dasharray:1]",
    delay: (index: number) => (cells / 2) * stagger + stagger * index,
  },
  {
    lines: majorLines,
    className: "stroke-4 stroke-theme-light [stroke-dasharray:1]",
    delay: (index: number) => index * stagger,
  },
];

export default function Grid() {
  return (
    <div className="absolute inset-0 -z-10 overflow-hidden opacity-50">
      <svg
        viewBox={[-radius, -radius, radius * 2, radius * 2].join(" ")}
        className={clsx("absolute top-1/2 w-full", classes.grid)}
      >
        {layers.map(({ lines, className, delay }, key) => (
          <g key={key} className={className}>
            {lines.map(({ horizontal, vertical, index }) => (
              <Fragment key={index}>
                <line
                  x1={horizontal.x1}
                  y1={horizontal.y1}
                  x2={horizontal.x2}
                  y2={horizontal.y2}
                  pathLength={1}
                  style={{ animationDelay: `${delay(index)}s` }}
                  className={classes.line}
                />
                <line
                  x1={vertical.x1}
                  y1={vertical.y1}
                  x2={vertical.x2}
                  y2={vertical.y2}
                  pathLength={1}
                  style={{ animationDelay: `${delay(index)}s` }}
                  className={classes.line}
                />
              </Fragment>
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
}
