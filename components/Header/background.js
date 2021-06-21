import styles from "./background.module.scss";

const cells = 40; // width/height of grid in minor cells
const major = 4; // every this many minor cells becomes major
const size = 50; // size of cell in svg units

const bound = (cells * size) / 2; // grid boundary from origin

// minor grid lines
const Minor = () => {
  const from = -cells / 2;
  const to = cells / 2;
  const h = [];
  const v = [];

  for (let i = from; i <= to; i++) {
    h.push(
      <line
        key={i}
        className={styles.line}
        x1={i * size}
        x2={i * size}
        y1={-bound}
        y2={bound}
      />
    );
    v.push(
      <line
        key={i}
        className={styles.line}
        x1={-bound}
        x2={bound}
        y1={i * size}
        y2={i * size}
      />
    );
  }

  return (
    <g fill="none" stroke="#808080" strokeWidth="2">
      <g>{h}</g>
      <g>{v}</g>
    </g>
  );
};

// major grid lines
const Major = () => {
  const from = -cells / major / 2;
  const to = cells / major / 2;
  const h = [];
  const v = [];

  for (let i = from; i <= to; i++) {
    h.push(
      <line
        key={i}
        className={styles.line}
        x1={major * i * size}
        x2={major * i * size}
        y1={-bound}
        y2={bound}
      />
    );
    v.push(
      <line
        key={i}
        className={styles.line}
        x1={-bound}
        x2={bound}
        y1={major * i * size}
        y2={major * i * size}
      />
    );
  }

  return (
    <g fill="none" stroke="#03a9f4" strokeWidth="5">
      <g>{h}</g>
      <g>{v}</g>
    </g>
  );
};

// grid visualization for header
const Background = () => (
  <div className={styles.background}>
    <svg
      className={styles.svg}
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`-${bound} -${bound} ${bound * 2} ${bound * 2}`}
    >
      <Minor />
      <Major />
    </svg>
  </div>
);

export default Background;
