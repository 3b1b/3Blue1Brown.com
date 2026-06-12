import { expose } from "comlink";
import { pairs } from "d3";
import { orderBy, range } from "lodash-es";
import { downloadTxt } from "~/util/download";
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

expose({ compute });

// parse svg source
export const parseSvg = (source: string, count: number) => {
  // parse svg
  const parser = new DOMParser();
  const svg = parser.parseFromString(source, "image/svg+xml");
  const path = svg.querySelector("path");
  if (!path) return "";

  // get path points
  const length = path.getTotalLength();
  const points = range(count).map((index) =>
    Vector.fromObject(path.getPointAtLength(length * (index / count))),
  );
  let list = joinList(points);

  // parse metadata
  for (const tag of ["title", "desc"]) {
    const meta = svg.querySelector(tag)?.textContent?.trim();
    if (meta) list = list.concat("\n", meta);
  }

  return list;
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

// get epicycles that reconstruct points with fft
const getEpicycles = (points: Vector[]) =>
  fft(points).map((point, index, array) => {
    const percent = index / array.length;
    return {
      frequency: 360 * (percent < 0.5 ? percent : percent - 1),
      amplitude: point.length(),
      phase: point.angle(),
    };
  });

// fast fourier transform
const fft = (points: Vector[]): Vector[] => {
  const count = points.length;
  // nearest upward power of 2
  const size = 2 ** Math.ceil(Math.log2(count));

  // resample points to fit power of 2
  points = resamplePoints(points, size);

  // multiply complex numbers via vectors
  const multiply = (a: Vector, b: Vector) =>
    a.rotate(b.angle()).scale(b.length());

  // complex exponential as vector rotation
  const rotate = (angle: number) => new Vector(1, 0).rotate(angle);

  // one level of recursion for each factor of 2
  const recurse = (points: Vector[]) => {
    const count = points.length;
    if (count <= 1) return points;

    // split even and odd frequencies, recursively solve smaller problems
    const evens = recurse(points.filter((_, index) => index % 2 === 0));
    const odds = recurse(points.filter((_, index) => index % 2 === 1));

    const result: Vector[] = [];

    // combine even and odd solutions
    for (const frequency of range(count / 2)) {
      const even = evens[frequency] ?? new Vector();
      const odd = odds[frequency] ?? new Vector();
      const angle = -360 * (frequency / count);
      const term = multiply(rotate(angle), odd);
      result[frequency] = even.add(term);
      result[frequency + count / 2] = even.subtract(term);
    }

    return result;
  };

  // normalize by size of input
  return recurse(points).map((point) => point.scale(1 / size));
};

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

// arc-length parameterization to get certain amount of evenly spaced points
export const resamplePoints = (points: Vector[], count: number): Vector[] => {
  if (points.length < 2) return points;

  // calculate cumulative distances between each pair of points
  let start = 0;
  let end = 0;
  const segments = pairs(points).map(([from, to]) => {
    end += from.distance(to);
    const segment = { from, start, to, end };
    start = end;
    return segment;
  });
  const total = end;

  // for each input point
  return range(count).map((index) => {
    // target length along path
    const target = (index / count) * total;
    // find segment that target falls between
    const segment = segments.find(({ end }) => target <= end);
    if (!segment) return new Vector();
    const { from, start, to, end } = segment;
    // mix between those points based on where target falls between their lengths
    const mix = (target - start) / (end - start);
    return from.mix(to, mix);
  });
};

// dev tool
if (import.meta.env.DEV)
  // convert all svgs to points
  addEventListener("keydown", (event) => {
    if (event.key !== "c") return;
    const svgs = import.meta.glob<{ default: string }>("./svgs/*.svg", {
      eager: true,
      query: "raw",
    });
    const counts: Record<string, number> = {
      hilbert: 10000,
      portrait: 10000,
    };
    for (const [key, source] of Object.entries(svgs)) {
      const [, name = ""] = key.match(/svgs\/(.*)\.svg/) ?? [];
      if (!name) continue;
      const count = counts[name] ?? 4000;
      const list = parseSvg(source.default, count);
      downloadTxt(list, name);
    }
  });
