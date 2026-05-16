// 2 pi
export const tau = 2 * Math.PI;

// trig in degrees
export const sin = (degrees: number) => Math.sin(tau * (degrees / 360));
export const cos = (degrees: number) => Math.cos(tau * (degrees / 360));
export const tan = (degrees: number) => Math.tan(tau * (degrees / 360));

// seeded random number generator
export const seededRandom = (seed: number) => () => {
  seed |= 0;
  seed = (seed + 0x6d2b79f5) | 0;
  let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

// shuffle with seed
export const seededShuffle = <Type>(array: Type[], seed: number) => {
  const rng = seededRandom(seed);
  const result = [...array];
  // fishers-yates
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
};

// round to multiple
export const round = (
  value: number,
  multiple = 1,
  method: "round" | "floor" | "ceil" = "round",
) => Math[method](value / multiple) * multiple;

type Point = { x: number; y: number; z: number };

// rotate point around x axis
export const rotateX = ({ x, y, z }: Point, degrees: number): Point => {
  const _cos = cos(degrees);
  const _sin = sin(degrees);
  return { x, y: y * _cos - z * _sin, z: y * _sin + z * _cos };
};

// rotate point around y axis
export const rotateY = ({ x, y, z }: Point, degrees: number): Point => {
  const _cos = cos(degrees);
  const _sin = sin(degrees);
  return { x: x * _cos + z * _sin, y, z: -x * _sin + z * _cos };
};

// rotate point around z axis
export const rotateZ = ({ x, y, z }: Point, degrees: number): Point => {
  const _cos = cos(degrees);
  const _sin = sin(degrees);
  return { x: x * _cos - y * _sin, y: x * _sin + y * _cos, z };
};

// perspective projection
export const project = ({ x, y, z }: Point, focalLength = 1) => {
  const scale = focalLength / (focalLength + z);
  return { x: x * scale, y: y * scale };
};
