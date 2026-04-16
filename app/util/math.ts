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
