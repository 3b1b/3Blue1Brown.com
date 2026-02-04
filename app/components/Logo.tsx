import { range } from "lodash-es";
import { tan } from "~/util/math";
import { Vector } from "~/util/vector";
import styles from "./Logo.module.css";

// number of furrows
const count = 28;
// colors
const blues = ["#000000", "#224C5B", "#528EA3", "#3E6576", "#74C0E3"] as const;
const browns = ["#000000", "#42210b", "#754C24", "#603813", "#8C6239"] as const;
// radii of iris/furrows/pupil
const radii = [25, 30, 37.5, 43.75, 50] as const;

// iris radius
const iris = Math.max(...radii);
// pupil radius
const pupil = Math.min(...radii);

// number of blue furrows
const blueSteps = (3 / 4) * count;
// number of brown furrows
const brownSteps = (1 / 4) * count;

// height of triangle
const height = iris / 2;
// width of triangle
const width = tan(360 / count) * height;

// range with inclusive end and offset
const _range = (start: number, delta: number, offset: number) =>
  range(start + offset, start + delta + 1 - offset);

// layers of furrows
const furrows = radii.slice(1).map((radius, radiusIndex) => ({
  radius,
  arcs: [
    // blue arc
    {
      color: blues[radiusIndex]!,
      steps: _range(0, blueSteps, radiusIndex === 2 ? 0.5 : 0),
    },
    // brown arc
    {
      color: browns[radiusIndex]!,
      steps: _range(blueSteps, brownSteps, radiusIndex === 2 ? 0.5 : 0),
    },
  ].map(({ steps, color }) => ({
    color,
    // triangle points for layer
    triangles: steps.map((step) => {
      // rotation to apply
      const rotate = 360 * (step / count);
      // make upright basic triangle
      const tip = new Vector(0, -radius).rotate(rotate);
      const base = new Vector(0, -radius + height).rotate(rotate);
      const left = new Vector(-width, -radius + height).rotate(rotate);
      const right = new Vector(width, -radius + height).rotate(rotate);
      // flatten to points
      return {
        step,
        points: [
          tip,
          step % 1 === 0 && step === steps.at(0) ? base : left,
          step % 1 === 0 && step === steps.at(-1) ? base : right,
        ].map((vector) => vector.toArray()),
      };
    }),
  })),
}));

// swap some furrow layers
[furrows[2], furrows[3]] = [furrows[3]!, furrows[2]!];

// reverse draw order
furrows.reverse();

export default function Logo({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={[-iris, -iris, 2 * iris, 2 * iris].join(" ")}
    >
      {/* iris */}
      <g className={styles.dilate}>
        <path
          fill={blues.at(-1)}
          d={`M 0 0 L 0 -${iris} A ${iris} ${iris} 0 1 1 -${iris} 0 z`}
        />
        <path
          fill={browns.at(-1)}
          d={`M 0 0 L 0 -${iris} A ${iris} ${iris} 0 0 0 -${iris} 0 z`}
        />
      </g>

      {/* furrows */}
      {furrows.map(({ radius, arcs }, radiusIndex) => (
        <g
          key={radius}
          className={styles.dilate}
          style={{ animationDelay: 1.5 * (radiusIndex / furrows.length) + "s" }}
        >
          {arcs.map(({ color, triangles }, arcIndex) => (
            <g key={arcIndex} fill={color}>
              {triangles.map(({ step, points }) => (
                <polygon
                  key={step}
                  points={points
                    .map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`)
                    .join(" ")}
                />
              ))}
            </g>
          ))}
        </g>
      ))}

      {/* pupil */}
      <g>
        <circle cx="0" cy="0" r={pupil} fill={blues.at(0)} />
      </g>
    </svg>
  );
}
