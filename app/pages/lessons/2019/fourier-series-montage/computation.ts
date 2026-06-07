import { expose } from "comlink";
import { pairs } from "d3";
import { orderBy, range } from "lodash-es";
import { Vector } from "~/util/vector";

export const compute = (points: Vector[], epicycleCount: number) => {
  // data gets serialized when passed to/from worker, so convert back to actual vector class
  points = points.map(Vector.fromObject);

  // get epicycles
  let epicycles = getEpicycles(points);

  // sort by amplitude
  epicycles = orderBy(epicycles, (point) => point.amplitude, "desc");

  // only use first, most impactful epicycles
  epicycles = epicycles.slice(0, epicycleCount);

  return epicycles;
};

// convert svg path to list of evenly spaced points
export const samplePath = (d: string, count: number) => {
  // make svg element
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);

  // sample points along path
  const length = path.getTotalLength();
  const points = range(count).map((index) =>
    Vector.fromObject(path.getPointAtLength(length * (index / count))),
  );

  return points;
};

// split list of coordinates into vectors
export const splitList = (list: string) =>
  list
    // line by line
    .split("\n")
    // get two numbers per line
    .map((line) => {
      const [x, y] = line
        .split(/[^0-9.-]+/)
        .filter((part) => part.trim())
        .map(Number);
      if (x === undefined || y === undefined) return;
      if (Number.isNaN(x) || Number.isNaN(y)) return;
      return new Vector(x, y);
    })
    // remove invalids
    ?.filter((point) => !!point)
    // convert to points
    .map(Vector.fromObject) ?? [];

// join vectors into list of coordinates
export const joinList = (points: Vector[]) =>
  points
    .map((point) => `${point.x.toFixed(5)}\t${point.y.toFixed(5)}`)
    .join("\n");

// fit points to [-1,1]
export const fitPoints = (
  points: Vector[],
  scale: "contain" | "cover" | "stretch" = "contain",
) => {
  // stretch to fit, without preserving aspect ratio
  if (scale === "stretch") return Vector.fit(points);

  // cover/contain to fit, while preserving aspect ratio
  const min = Vector.min(points);
  const max = Vector.max(points);
  const width = max.x - min.x;
  const height = max.y - min.y;
  const shorter = Math.min(width, height);
  const longer = Math.max(width, height);
  const multiply = new Vector(
    (scale === "cover" ? longer : shorter) / height,
    (scale === "cover" ? longer : shorter) / width,
  );
  return Vector.fit(points).map((point) => point.multiply(multiply));
};

// get epicycles that reconstruct points with discrete fourier transform
// https://www.jezzamon.com/fourier/
// https://dsp.stackexchange.com/questions/59068/how-to-get-fourier-coefficients-to-draw-any-shape-using-dft
const getEpicycles = (points: Vector[]) =>
  range(0, points.length)
    .map(
      (frequency) =>
        // map to degrees
        360 *
        // percent
        (frequency / points.length -
          // handle nyquist
          (frequency > points.length / 2 ? 1 : 0)),
    )
    .map((frequency) => {
      let result = new Vector();
      points.forEach(
        (point, index) =>
          (result = result.add(point.rotate(-frequency * index))),
      );
      result = result.scale(1 / points.length);
      return { frequency, amplitude: result.length(), phase: result.angle() };
    });

// chaikin smoothing
export const smoothPoints = (points: Vector[], level: number): Vector[] => {
  if (level === 0 || points.length < 2) return points;
  const smoothed = points
    .map((from, index) => {
      const to = points[(index + 1) % points.length] ?? from;
      return [from.mix(to, 0.33), from.mix(to, 0.66)];
    })
    .flat();
  return level === 1 ? smoothed : smoothPoints(smoothed, level - 1);
};

// arc-length parameterization to get evenly spaced points
export const resamplePoints = (points: Vector[], count: number): Vector[] => {
  if (points.length < 2) return points;

  // cumulative arc-lengths
  let total = 0;
  const lengths = pairs(points).map(
    ([from, to]) => (total += from.distance(to)),
  );

  return range(count).map((index) => {
    // target length along path
    const target = (index / count) * total;
    for (let index = 1; index < lengths.length; index++) {
      // find first segment that surpasses target length
      if ((lengths[index] ?? 0) >= target) {
        const lowerLength = lengths[index - 1];
        const upperLength = lengths[index];
        if (!lowerLength || !upperLength) continue;
        const lowerPoint = points[index - 1];
        const upperPoint = points[index];
        if (!lowerPoint || !upperPoint) continue;
        // interpolate along segment
        const percent = (target - lowerLength) / (upperLength - lowerLength);
        return lowerPoint.mix(upperPoint, percent);
      }
    }
    return new Vector();
  });
};

expose({ compute });
