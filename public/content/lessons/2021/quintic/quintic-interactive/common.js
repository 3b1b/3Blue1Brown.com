import { useState, useMemo } from "react";

export const Complex = {
  neg(a) {
    return [-a[0], -a[1]];
  },
  inverse(a) {
    return [a[0] / (a[0] ** 2 + a[1] ** 2), -a[1] / (a[0] ** 2 + a[1] ** 2)];
  },
  abs(a) {
    return [Math.hypot(a[0], a[1]), 0];
  },
  scale(scalar, num) {
    return [scalar * num[0], scalar * num[1]];
  },
  add(...nums) {
    return nums.reduce((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);
  },
  subtract(a, b) {
    return [a[0] - b[0], a[1] - b[1]];
  },
  multiply(...nums) {
    return nums.reduce(
      (a, b) => [a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]],
      [1, 0]
    );
  },
  divide(a, b) {
    return Complex.multiply(a, Complex.inverse(b));
  },
  power(base, power) {
    let result = [1, 0];
    for (let i = 0; i < power; i++) {
      result = Complex.multiply(result, base);
    }
    return result;
  },
  roots(degree, num) {
    const magnitude = Math.hypot(num[0], num[1]);
    const angle = Math.atan2(num[1], num[0]);

    let roots = [];
    for (let k = 0; k < degree; k++) {
      roots.push([
        magnitude ** (1 / degree) *
          Math.cos((angle + 2 * Math.PI * k) / degree),
        magnitude ** (1 / degree) *
          Math.sin((angle + 2 * Math.PI * k) / degree),
      ]);
    }
    return roots;
  },
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
  return Complex.add(
    ...coeffs.map((value, i) => Complex.multiply(value, Complex.power(x, i)))
  );
}

function evalDPoly(coeffs, x) {
  return Complex.add(
    ...coeffs.map((value, i) =>
      i === 0
        ? [0, 0]
        : Complex.multiply(Complex.scale(i, value), Complex.power(x, i - 1))
    )
  );
}

function rootsToCoefficients(roots) {
  const n = roots.length;
  let coeffs = [];
  for (let k = 0; k <= roots.length; k++) {
    const combos = combinations(roots, n - k);
    const sum = Complex.add(
      ...combos.map((values) => Complex.multiply(...values))
    );
    const result = Complex.scale((-1) ** (n - k), sum);
    coeffs.push(result);
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

    let multiplier = (q[dN - dD] = Complex.divide(N[dN], d[d.length - 1]));
    d = d.map((coeff) => Complex.multiply(coeff, multiplier));

    N = N.map((_, i) => Complex.subtract(N[i], d[i] || [0, 0]));
    dN = polynomialDegree(N);
  }

  return q;
}

function findRoot(f, df) {
  let guess = [1, 1];

  for (let i = 0; i < 50; i++) {
    guess = Complex.subtract(guess, Complex.divide(f(guess), df(guess)));
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
      [Complex.scale(-1, root), [1, 0]] // polynomial (x - root)
    );
  }

  return roots;
}

/*
  As the coefficients change, sometimes the calculdated roots jump around.
  To preserve a nice continuous animation, we reorder the roots so that they
  match their previous positions closely.
*/
export function sortToMinimizeDistances(points, prevPoints) {
  let orderedPoints = [];
  let unusedPoints = [...points];

  for (const point of prevPoints) {
    const distances = unusedPoints.map(
      (p) => Complex.abs(Complex.subtract(point, p))[0]
    );
    const minIndex = distances.indexOf(Math.min(...distances));
    orderedPoints.push(unusedPoints[minIndex]);
    unusedPoints.splice(minIndex, 1);
  }

  return orderedPoints;
}

function getPointCycler(points, indicesToCycle) {
  const centroid = Complex.scale(
    1 / points.length,
    points
      .filter((_, i) => indicesToCycle.includes(i))
      .reduce((a, b) => Complex.add(a, b), [0, 0])
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

    horizontalOffset = Complex.scale(horizontalAmount, horizontalOffset);

    return Complex.add(linearPathPoint, horizontalOffset);
  };

  return (t = 0) => {
    return points.map((_, index) => getPointPosition(index, t));
  };
}

export function useRootsAndCoeffs(defaultRoots) {
  const [roots, setRoots] = useState(defaultRoots);

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

  return {
    roots,
    setRoots,
    setRoot,
    coefficients,
    setCoefficients,
    setCoefficient,
  };
}

export function restrictPointValue(
  value,
  minX = -4.5,
  maxX = 4.5,
  minY = minX,
  maxY = maxX
) {
  value[0] = Math.min(Math.max(value[0], minX), maxX);
  value[1] = Math.min(Math.max(value[1], minY), maxY);
  return value;
}

export function usePointCycler(roots, setRoots, coefficients, setCoefficients) {
  const [isCycling, setIsCycling] = useState(false);
  const cyclePoints = (type, indices) => {
    if (isCycling) return;

    setIsCycling(true);

    let currentValues = type === "coeffs" ? coefficients : roots;

    const cycler = getPointCycler(currentValues, indices);

    const duration = indices.length === 1 ? 2000 : 1600;

    const startTime = Date.now();
    const update = () => {
      let t = (Date.now() - startTime) / duration;
      t = Math.min(Math.max(t, 0), 1);

      if (t < 1) {
        requestAnimationFrame(update);
      } else {
        setIsCycling(false);
      }

      if (type === "coeffs") {
        setCoefficients(cycler(t));
      } else {
        setRoots(cycler(t));
      }
    };
    requestAnimationFrame(update);
  };

  return [cyclePoints, isCycling];
}
