import { cos, sin } from "~/util/math";

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
