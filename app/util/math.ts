import { clamp } from "lodash-es";

// 2 pi
export const tau = 2 * Math.PI;

// trig in degrees
export const sin = (degrees: number) => Math.sin(tau * (degrees / 360));
export const cos = (degrees: number) => Math.cos(tau * (degrees / 360));
export const tan = (degrees: number) => Math.tan(tau * (degrees / 360));

// map value from source range to target range
export const lerp = (
  value: number,
  sourceMin: number,
  sourceMax: number,
  targetMin: number,
  targetMax: number,
) =>
  targetMin +
  clamp((value - sourceMin) / (sourceMax - sourceMin || 1), 0, 1) *
    (targetMax - targetMin);

// round to multiple
export const round = (
  value: number,
  multiple = 1,
  method: "round" | "floor" | "ceil" = "round",
) => Math[method](value / multiple) * multiple;

// 2d distance
export const dist = (ax = 0, ay = 0, bx = 0, by = 0) =>
  Math.hypot(bx - ax, by - ay);
