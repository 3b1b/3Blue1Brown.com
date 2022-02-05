import GraphWindow, {
  GraphPoint,
  GraphTrail,
  GraphLines,
} from "../../../../../../components/Graph";

import styles from "./index.module.scss";
import { useMemo, useState, Fragment } from "react";
import Markdownify from "../../../../../../components/Markdownify";

export default function QuinticInteractive() {
  const [roots, setRoots] = useState([
    [-1.3247, 0.0],
    [0.0, 1.0],
    [0.0, -1.0],
    [0.66236, -0.56228],
    [0.66236, 0.56228],
  ]);

  const setRoot = (index, value) => {
    setRoots((roots) => [
      ...roots.slice(0, index),
      value,
      ...roots.slice(index + 1),
    ]);
  };

  const coefficients = useMemo(() => rootsToCoefficients(roots), [roots]);

  const setCoefficients = (newCoeffs) => {
    let newRoots = findPolynomialRoots(newCoeffs);
    newRoots = sortToMinimizeDistances(newRoots, roots);
    setRoots(newRoots);
  };

  const setCoefficient = (index, value) => {
    setCoefficients([
      ...coefficients.slice(0, index),
      value,
      ...coefficients.slice(index + 1),
    ]);
  };

  const restrictPointValue = (
    value,
    minX = -4.5,
    maxX = 4.5,
    minY = minX,
    maxY = maxX
  ) => {
    value[0] = Math.min(Math.max(value[0], minX), maxX);
    value[1] = Math.min(Math.max(value[1], minY), maxY);
    return value;
  };

  return (
    <div className={styles.container}>
      <div className={styles.equation}>
        <Markdownify noParagraph={true}>
          {String.raw`$
            x^5 +
            \textcolor{red}{c_4} x^4 +
            \textcolor{red}{c_3} x^3 +
            \textcolor{red}{c_2} x^2 +
            \textcolor{red}{c_1} x +
            \textcolor{red}{c_0}
            =
            (x - \textcolor{gold}{r_0})
            (x - \textcolor{gold}{r_1})
            (x - \textcolor{gold}{r_2})
            (x - \textcolor{gold}{r_3})
            (x - \textcolor{gold}{r_4})
          $`}
        </Markdownify>
      </div>
      <div className={styles.coeffs}>
        <div className={styles.graph}>
          <GraphWindow width={300} height={300} center={[0, 0]} radius={3.5}>
            <GraphLines
              step={0.2}
              color="rgba(255, 255, 255, 0.2)"
              labels={false}
            />
            <GraphLines
              step={1}
              color="rgba(255, 255, 255, 0.5)"
              labels={true}
              labelY={(n) => `${n}i`}
              labelStr={(n, axis) => {
                let str = new Intl.NumberFormat().format(n);
                if (axis === "y") str += "i";
                return str;
              }}
              fontSize={24}
            />

            {coefficients.slice(0, -1).map((coeff, i) => (
              <Fragment key={i}>
                <GraphPoint
                  x={coeff[0]}
                  y={coeff[1]}
                  onDrag={(newValue) => {
                    newValue = restrictPointValue(newValue, -3.5, 3.5);
                    setCoefficient(i, newValue);
                  }}
                  size={16}
                  color="red"
                  label={
                    <Markdownify noParagraph={true}>
                      {String.raw`$c_{${i}}$`}
                    </Markdownify>
                  }
                />
                <GraphTrail x={coeff[0]} y={coeff[1]} size={8} color="red" />
              </Fragment>
            ))}
          </GraphWindow>
        </div>
        <Markdownify noParagraph={true}>
          {String.raw`$\text{Coefficients}$`}
        </Markdownify>
      </div>
      <div className={styles.roots}>
        <div className={styles.graph}>
          <GraphWindow width={300} height={300} center={[0, 0]} radius={2.5}>
            <GraphLines
              step={0.2}
              color="rgba(255, 255, 255, 0.2)"
              labels={false}
            />
            <GraphLines
              step={1}
              color="rgba(255, 255, 255, 0.5)"
              labels={true}
              labelY={(n) => `${n}i`}
              labelStr={(n, axis) => {
                let str = new Intl.NumberFormat().format(n);
                if (axis === "y") str += "i";
                return str;
              }}
              fontSize={24}
            />

            {roots.map((root, i) => (
              <Fragment key={i}>
                <GraphPoint
                  x={root[0]}
                  y={root[1]}
                  onDrag={(newValue) => {
                    newValue = restrictPointValue(newValue, -2.5, 2.5);
                    setRoot(i, newValue);
                  }}
                  size={16}
                  color="yellow"
                  label={
                    <Markdownify noParagraph={true}>
                      {String.raw`$r_{${i}}$`}
                    </Markdownify>
                  }
                />
                <GraphTrail x={root[0]} y={root[1]} size={8} color="yellow" />
              </Fragment>
            ))}
          </GraphWindow>
        </div>
        <Markdownify noParagraph={true}>
          {String.raw`$\text{Roots}$`}
        </Markdownify>
      </div>
    </div>
  );
}

const neg = (a) => [-a[0], -a[1]];
const add = (...nums) => {
  return nums.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
};
const sub = (a, b) => add(a, neg(b));

const scale = (scalar, num) => [scalar * num[0], scalar * num[1]];

const abs = (a) => [Math.hypot(a[0], a[1]), 0];

const inverse = (a) => [
  a[0] / (a[0] ** 2 + a[1] ** 2),
  -a[1] / (a[0] ** 2 + a[1] ** 2),
];
const mult = (...nums) => {
  return nums.reduce(
    (a, b) => [a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]],
    [1, 0]
  );
};
const div = (a, b) => mult(a, inverse(b));

const pow = (a, power) => {
  let result = [1, 0];
  for (let i = 0; i < power; i++) {
    result = mult(result, a);
  }
  return result;
};

function combinations(arr, size = null) {
  const getAllCombinations = (arr) => {
    if (arr.length === 0) return [[]];

    const allSubCombos = getAllCombinations(arr.slice(1));
    return [...allSubCombos, ...allSubCombos.map((b) => [arr[0], ...b])];
  };

  const allCombos = getAllCombinations(arr);
  if (size === null) {
    return allCombos;
  }

  return allCombos.filter((combo) => combo.length === size);
}

function evalPoly(coeffs, x) {
  return add(...coeffs.map((value, i) => mult(value, pow(x, i))));
}

function evalDPoly(coeffs, x) {
  return add(
    ...coeffs.map((value, i) =>
      i === 0 ? [0, 0] : mult(scale(i, value), pow(x, i - 1))
    )
  );
}

function rootsToCoefficients(roots) {
  const n = roots.length;
  let coeffs = [];
  for (let k = 0; k <= roots.length; k++) {
    coeffs.push(
      scale(
        (-1) ** (n - k),
        add(...combinations(roots, n - k).map((values) => mult(...values)))
      )
    );
  }
  return coeffs;
}

function polynomialDegree(coeffs) {
  let deg = coeffs.length - 1;
  while (deg > -1 && coeffs[deg][0] === 0 && coeffs[deg][1] === 0) {
    deg--;
  }
  return deg;
}

// Based on python code at
// https://rosettacode.org/wiki/Polynomial_long_division#Python
function polynomialDivision(N, D) {
  let dD = polynomialDegree(D);
  let dN = polynomialDegree(N);

  if (dD < 0) {
    throw new Error("Polynomial division: Cannot divide by 0");
  }

  if (dN < dD) {
    return [[0, 0]];
  }

  let q = new Array(dN).fill(null).map(() => [0, 0]);

  while (dN >= dD) {
    let d = [...new Array(dN - dD).fill(null).map(() => [0, 0]), ...D];

    let multiplier = (q[dN - dD] = div(N[dN], d[d.length - 1]));
    d = d.map((coeff) => mult(coeff, multiplier));

    N = N.map((_, i) => sub(N[i], d[i] || [0, 0]));
    dN = polynomialDegree(N);
  }

  return q;
}

function findRoot(f, df) {
  let guess = [1, 1];

  for (let i = 0; i < 50; i++) {
    guess = sub(guess, div(f(guess), df(guess)));
  }

  return guess;
}

// Based on python code at
// https://rosettacode.org/wiki/Polynomial_long_division#Python
function findPolynomialRoots(coeffs) {
  let roots = [];

  const degree = polynomialDegree(coeffs);

  for (let i = 0; i < degree; i++) {
    const root = findRoot(
      (x) => evalPoly(coeffs, x),
      (x) => evalDPoly(coeffs, x)
    );

    roots.push(root);

    coeffs = polynomialDivision(
      coeffs,
      [scale(-1, root), [1, 0]] // polynomial (x - root)
    );
  }

  return roots;
}

/*
  As the coefficients change, sometimes the calculdated roots jump around.
  To preserve a nice continuous animation, we reorder the roots so that they
  match their previous positions closely.
*/
function sortToMinimizeDistances(points, prevPoints) {
  let orderedPoints = [];
  let unusedPoints = [...points];

  for (const point of prevPoints) {
    const distances = unusedPoints.map((p) => abs(sub(point, p))[0]);
    const minIndex = distances.indexOf(Math.min(...distances));
    orderedPoints.push(unusedPoints[minIndex]);
    unusedPoints.splice(minIndex, 1);
  }

  return orderedPoints;
}
