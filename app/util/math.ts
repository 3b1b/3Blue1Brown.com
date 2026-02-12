// 2 pi
export const tau = 2 * Math.PI;

// trig in degrees
export const sin = (degrees: number) => Math.sin(tau * (degrees / 360));
export const cos = (degrees: number) => Math.cos(tau * (degrees / 360));
export const tan = (degrees: number) => Math.tan(tau * (degrees / 360));

// round to multiple
export const round = (
  value: number,
  multiple = 1,
  method: "round" | "floor" | "ceil" = "round",
) => Math[method](value / multiple) * multiple;
