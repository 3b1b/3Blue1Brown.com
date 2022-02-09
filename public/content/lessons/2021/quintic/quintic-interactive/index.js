import GraphWindow, {
  GraphPoint,
  GraphTrail,
  GraphLines,
} from "../../../../../../components/Graph";
import { useMemo, useState, Fragment } from "react";
import styles from "./index.module.scss";

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
    // The coefficients are determined from the roots, so we can't
    // set them directly. Instead, we set the roots so that the coefficients
    // become what we want them to be.
    setRoots((oldRoots) => {
      let newRoots = findPolynomialRoots(newCoeffs);
      newRoots = sortToMinimizeDistances(newRoots, oldRoots);
      return newRoots;
    });
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

  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState({ type: null, indices: [] });

  const togglePointSelected = (type, index) => {
    setSelection((selection) => {
      let newSelection;
      if (selection === null) {
        newSelection = { type: null, indices: [] };
      } else {
        newSelection = { ...selection };
      }

      if (selection.type === null || selection.type === type) {
        if (newSelection.indices.includes(index)) {
          newSelection.indices = newSelection.indices.filter(
            (i) => i !== index
          );
          if (newSelection.indices.length === 0) {
            newSelection.type = null;
          }
        } else {
          newSelection.indices.push(index);
          newSelection.type = type;
        }
      }

      return newSelection;
    });
  };

  const [isCycling, setIsCycling] = useState(false);
  const cycleSelection = () => {
    if (isCycling) return;

    setIsCycling(true);

    let currentValues =
      selection.type === "coeffs" ? [...coefficients] : [...roots];

    const cycler = getPointCycler(currentValues, selection.indices);

    const duration = selection.indices.length === 1 ? 2000 : 1600;

    const startTime = Date.now();
    const update = () => {
      let t = (Date.now() - startTime) / duration;
      t = Math.min(Math.max(t, 0), 1);

      if (t < 1) {
        requestAnimationFrame(update);
      } else {
        setIsCycling(false);
      }

      if (selection.type === "coeffs") {
        setCoefficients(cycler(t));
      } else {
        setRoots(cycler(t));
      }
    };
    requestAnimationFrame(update);
  };

  return (
    <div className={styles.container}>
      <div className={styles.coeffs}>
        <Markdownify noParagraph={true}>
          {String.raw`$\text{Coefficients} \\
{\scriptsize x^5 +
\textcolor{red}{c_4} x^4 +
\textcolor{red}{c_3} x^3 +
\textcolor{red}{c_2} x^2 +
\textcolor{red}{c_1} x +
\textcolor{red}{c_0}}$`}
        </Markdownify>
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
              fontSize={18}
            />

            {coefficients.slice(0, -1).map((coeff, i) => (
              <Fragment key={i}>
                <GraphPoint
                  x={coeff[0]}
                  y={coeff[1]}
                  onDrag={
                    !isSelecting
                      ? (newValue) => {
                          newValue = restrictPointValue(newValue, -3.5, 3.5);
                          setCoefficient(i, newValue);
                        }
                      : undefined
                  }
                  onClick={
                    isSelecting && selection.type !== "roots"
                      ? () => togglePointSelected("coeffs", i)
                      : undefined
                  }
                  selected={
                    isSelecting &&
                    selection.type === "coeffs" &&
                    selection.indices.includes(i)
                  }
                  size={12}
                  color="red"
                  label={
                    <Markdownify noParagraph={true}>
                      {String.raw`$c_{${i}}$`}
                    </Markdownify>
                  }
                />
                <GraphTrail
                  x={coeff[0]}
                  y={coeff[1]}
                  size={6}
                  color="red"
                  duration={800}
                />
              </Fragment>
            ))}

            {isSelecting &&
              selection.type === "coeffs" &&
              selection.indices.length > 0 && (
                <button
                  className={styles.actionButton}
                  disabled={isCycling || selection.indices.length === 0}
                  onClick={() => cycleSelection()}
                >
                  <i className="fas fa-sync-alt"></i> Cycle{" "}
                  {selection.indices.length}{" "}
                  {selection.type === null
                    ? "point"
                    : selection.type === "coeffs"
                    ? "coefficient"
                    : "root"}
                  {selection.indices.length !== 1 && "s"}
                </button>
              )}
          </GraphWindow>
        </div>
      </div>
      <div className={styles.roots}>
        <Markdownify noParagraph={true}>
          {String.raw`$\text{Roots} \\
{\scriptsize (x - \textcolor{gold}{r_0})
(x - \textcolor{gold}{r_1})
(x - \textcolor{gold}{r_2})
(x - \textcolor{gold}{r_3})
(x - \textcolor{gold}{r_4})}$`}
        </Markdownify>
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
              fontSize={18}
            />

            {roots.map((root, i) => (
              <Fragment key={i}>
                <GraphPoint
                  x={root[0]}
                  y={root[1]}
                  onDrag={
                    !isSelecting
                      ? (newValue) => {
                          newValue = restrictPointValue(newValue, -2.5, 2.5);
                          setRoot(i, newValue);
                        }
                      : undefined
                  }
                  onClick={
                    isSelecting && selection.type !== "coeffs"
                      ? () => togglePointSelected("roots", i)
                      : undefined
                  }
                  selected={
                    isSelecting &&
                    selection.type === "roots" &&
                    selection.indices.includes(i)
                  }
                  size={12}
                  color="yellow"
                  label={
                    <Markdownify noParagraph={true}>
                      {String.raw`$r_{${i}}$`}
                    </Markdownify>
                  }
                />
                <GraphTrail
                  x={root[0]}
                  y={root[1]}
                  size={6}
                  color="yellow"
                  duration={800}
                />
              </Fragment>
            ))}

            {isSelecting &&
              selection.type === "roots" &&
              selection.indices.length > 0 && (
                <button
                  className={styles.actionButton}
                  disabled={isCycling || selection.indices.length === 0}
                  onClick={() => cycleSelection()}
                >
                  <i className="fas fa-sync-alt"></i> Cycle{" "}
                  {selection.indices.length}{" "}
                  {selection.type === null
                    ? "point"
                    : selection.type === "coeffs"
                    ? "coefficient"
                    : "root"}
                  {selection.indices.length !== 1 && "s"}
                </button>
              )}
          </GraphWindow>
        </div>
      </div>
      <div className={styles.controls}>
        <div>
          <button
            className={styles.controlButton}
            disabled={!isSelecting}
            onClick={() => {
              setIsSelecting(false);
              setSelection({ type: null, indices: [] });
            }}
          >
            <i className="fas fa-arrows-alt"></i> Move
          </button>
          <button
            className={styles.controlButton}
            disabled={isSelecting}
            onClick={() => setIsSelecting(true)}
          >
            <i className="fas fa-hand-pointer"></i> Select
          </button>
        </div>

        {/* <div>
          {isSelecting && selection.indices.length > 0 && (
            <button
              className={styles.actionButton}
              disabled={isCycling || selection.indices.length === 0}
              onClick={() => cycleSelection()}
            >
              <i className="fas fa-sync-alt"></i> Cycle{" "}
              {selection.indices.length}{" "}
              {selection.type === null
                ? "point"
                : selection.type === "coeffs"
                ? "coefficient"
                : "root"}
              {selection.indices.length !== 1 && "s"}
            </button>
          )}
        </div> */}
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

function getPointCycler(points, indicesToCycle) {
  const centroid = scale(
    1 / points.length,
    points
      .filter((_, i) => indicesToCycle.includes(i))
      .reduce((a, b) => add(a, b), [0, 0])
  );

  indicesToCycle = indicesToCycle.sort((indexA, indexB) => {
    const pointA = points[indexA];
    const pointB = points[indexB];

    return (
      Math.atan2(pointA[1] - centroid[1], pointA[0] - centroid[0]) -
      Math.atan2(pointB[1] - centroid[1], pointB[0] - centroid[0])
    );
  });

  const getPointPosition = (index, t = 0) => {
    if (!indicesToCycle.includes(index)) {
      return points[index];
    }

    const fromPoint = points[index];

    if (indicesToCycle.length === 1) {
      // If this is the only moving point, rotate it around the origin
      const dist = Math.hypot(fromPoint[0], fromPoint[1]);
      let angle = Math.atan2(fromPoint[1], fromPoint[0]);
      angle += t * 2 * Math.PI;
      return [dist * Math.cos(angle), dist * Math.sin(angle)];
    }

    const towardsIndex =
      indicesToCycle[
        (indicesToCycle.indexOf(index) + 1) % indicesToCycle.length
      ];

    const towardsPoint = points[towardsIndex];

    const linearPathPoint = [
      fromPoint[0] + (towardsPoint[0] - fromPoint[0]) * t,
      fromPoint[1] + (towardsPoint[1] - fromPoint[1]) * t,
    ];

    const dist = Math.hypot(
      towardsPoint[0] - fromPoint[0],
      towardsPoint[1] - fromPoint[1]
    );
    const direction = Math.atan2(
      towardsPoint[1] - fromPoint[1],
      towardsPoint[0] - fromPoint[0]
    );

    const horizontalAmount = 0.3 * dist * (1 - (2 * t - 1) ** 2);

    let horizontalOffset = [
      Math.cos(direction - Math.PI / 2),
      Math.sin(direction - Math.PI / 2),
    ];

    horizontalOffset = scale(horizontalAmount, horizontalOffset);

    return add(linearPathPoint, horizontalOffset);
  };

  return (t = 0) => {
    return points.map((_, index) => getPointPosition(index, t));
  };
}
