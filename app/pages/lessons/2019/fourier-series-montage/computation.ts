import { expose } from "comlink";
import { orderBy, range } from "lodash-es";
import { Vector } from "~/util/vector";

// get epicycles that reconstruct points with discrete fourier transform
export const getEpicycles = (
  // (Vector class can't be serialized across web worker boundary)
  _points: { x: number; y: number }[],
  cycleCount: number,
) => {
  // convert to Vector class
  const points = _points.map((point) => new Vector(point.x, point.y));

  // https://www.jezzamon.com/fourier/
  // https://dsp.stackexchange.com/questions/59068/how-to-get-fourier-coefficients-to-draw-any-shape-using-dft
  let epicycles = range(-points.length / 2, points.length / 2)
    // normalize frequency to [0,360)
    .map((frequency) => 360 * (frequency / points.length))
    .map((frequency) => {
      let result = new Vector();
      points.forEach(
        (point, index) =>
          (result = result.add(point.rotate(-frequency * index))),
      );
      result = result.scale(1 / points.length);
      return { frequency, amplitude: result.length(), phase: result.angle() };
    });

  // sort by amplitude
  epicycles = orderBy(epicycles, (point) => point.amplitude, "desc");

  // only use first, most impactful epicycles
  epicycles = epicycles.slice(0, cycleCount);

  return epicycles;
};

// convert svg path to list of points in [-1,1]
export const getPoints = (
  d: string,
  count: number,
  scale: "contain" | "cover" | "stretch" = "contain",
) => {
  // make svg element
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);

  // sample points along path
  const length = path.getTotalLength();
  const points = range(count).map((index) =>
    Vector.fromObject(path.getPointAtLength(length * (index / count))),
  );

  // stretch to fit [-1,1], without preserving aspect ratio
  if (scale === "stretch") return Vector.fit(points);

  // cover/contain to fit in [-1,1], while preserving aspect ratio
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

// {
//   const path = "m10.5 177.038";
//   const count = 1000;
//   const points = getPoints(path, count);
//   const list = points
//     .map(({ x, y }) => `${x.toFixed(5)}\t${y.toFixed(5)}`)
//     .join("\n");
//   console.info(list);
// }

export type Epicycle = ReturnType<typeof getEpicycles>[number];

expose({ getEpicycles });
