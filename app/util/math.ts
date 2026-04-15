// 2 pi
export const tau = 2 * Math.PI;

// trig in degrees
export const sin = (degrees: number) => Math.sin(tau * (degrees / 360));
export const cos = (degrees: number) => Math.cos(tau * (degrees / 360));
export const tan = (degrees: number) => Math.tan(tau * (degrees / 360));

// simple seeded PRNG (mulberry32)
export function seededRandom(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6d2b79f5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// shuffle array with a given RNG
export function shuffle<T>(arr: T[], rand: () => number): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

// round to multiple
export const round = (
  value: number,
  multiple = 1,
  method: "round" | "floor" | "ceil" = "round",
) => Math[method](value / multiple) * multiple;
