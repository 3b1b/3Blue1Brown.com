import { range, sin, cos } from "../../util/math";
import styles from "./index.module.scss";

// alt colors
// const blue = ["#03a9f4", "#0288d1", "#0277bd", "#01579b", "#000000"];
// const brown = ["#855835", "#694229", "#5c3724", "#4a2a1b", "#000000"];

// colors
const blue = ["#74C0E3", "#528EA3", "#3E6576", "#224C5B", "#000000"];
const brown = ["#8C6239", "#754C24", "#603813", "#42210b", "#000000"];

const n = 28; // number of star points
const da = 360 / n; // angle step
const h = 50; // triangle height
const b = h * Math.tan((2 * Math.PI) / n); // half triangle base

// iris star radii
const r0 = 50;
const r1 = 43.75;
const r2 = 37.5;
const r3 = 30;
const r4 = 25;

const Logo = ({ big }) => (
  <svg
    className={styles.logo}
    data-big={big}
    viewBox={`-${r0} -${r0} ${r0 * 2} ${r0 * 2}`}
  >
    <IrisBack />
    <IrisOffset r={r1} color={1} />
    <Iris r={r0} color={2} />
    <Iris r={r2} color={3} />
    <Iris r={r3} color={4} />
    <Pupil />
  </svg>
);

const IrisBack = () => (
  <g className={styles.dilate_outer}>
    <path
      fill={blue[0]}
      d={`M 0 0 L 0 -${r0} A ${r0} ${r0} 0 1 1 -${r0} 0 z`}
    />
    <path
      fill={brown[0]}
      d={`M 0 0 L 0 -${r0} A ${r0} ${r0} 0 0 0 -${r0} 0 z`}
    />
  </g>
);

const Triangle = ({ a, r, color, half }) => {
  a *= da;
  const tip = [cos(a) * r, -sin(a) * r];
  const base = [cos(a) * (r - h), -sin(a) * (r - h)];
  const left = [base[0] + cos(a + 90) * b, base[1] - sin(a + 90) * b];
  const right = [base[0] + cos(a - 90) * b, base[1] - sin(a - 90) * b];
  const points = [
    tip,
    half === "right" ? base : left,
    half === "left" ? base : right,
  ]
    .map(([x, y]) => x.toFixed(2) + "," + y.toFixed(2))
    .join(" ");
  return <polygon fill={color} points={points} />;
};

const IrisOffset = ({ r, color }) => (
  <g className={styles.dilate_inner}>
    {range(-14, 7).map((a, index) => (
      <Triangle key={index} a={a + 0.5} r={r1} color={blue[color]} />
    ))}
    {range(7, 14).map((a, index) => (
      <Triangle key={index} a={a + 0.5} r={r1} color={brown[color]} />
    ))}
  </g>
);

const Iris = ({ r, color }) => (
  <g className={styles.dilate_inner}>
    <Triangle a={-14} r={r} color={blue[color]} half="left" />
    {range(-13, 7).map((a, index) => (
      <Triangle key={index} a={a} r={r} color={blue[color]} />
    ))}
    <Triangle a={7} r={r} color={blue[color]} half="right" />
    <Triangle a={7} r={r} color={brown[color]} half="left" />
    {range(8, 14).map((a, index) => (
      <Triangle key={index} a={a} r={r} color={brown[color]} />
    ))}
    <Triangle a={14} r={r} color={brown[color]} half="right" />
  </g>
);

const Pupil = () => (
  <g>
    <circle cx="0" cy="0" r={r4} fill={blue[4]} />
  </g>
);

export default Logo;
