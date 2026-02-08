/** https://gist.github.com/vincerubinetti/52ec86385ef42f1cd205ad4783a87d5d */

export class Vector {
  x: number;
  y: number;

  static angleUnits: "radians" | "degrees" = "degrees";

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  static fromObject(object: { x: number; y: number }) {
    return new Vector(object.x, object.y);
  }

  static fromArray(array: [number, number]) {
    return new Vector(...array);
  }

  static fromPolar({ length, angle }: { length: number; angle: number }) {
    return new Vector(length * Vector.cos(angle), length * Vector.sin(angle));
  }

  toObject() {
    return { x: this.x, y: this.y };
  }

  toArray() {
    return [this.x, this.y] satisfies [number, number];
  }

  toPolar() {
    return { length: this.length(), angle: this.angle() };
  }

  toString(precision = 3, separator = ",") {
    return [this.x, this.y]
      .map((value) => value.toFixed(precision).replace(/\.*0+$/, ""))
      .join(separator);
  }

  equals(other: Vector) {
    return this.x == other.x && this.y == other.y;
  }

  length(): number;
  length(length: number): Vector;
  length(length?: number) {
    if (length === undefined) return Math.hypot(this.x, this.y);
    else return this.normalize().scale(length);
  }

  lengthSquared() {
    return this.x ** 2 + this.y ** 2;
  }

  distanceTo(other: Vector) {
    return other.subtract(this).length();
  }

  angle(): number;
  angle(angle: number): Vector;
  angle(angle?: number) {
    if (angle === undefined) return Vector.atan2(this.y, this.x);
    else return Vector.fromPolar({ length: this.length(), angle });
  }

  angleTo(other: Vector) {
    return other.angle() - this.angle();
  }

  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y);
  }

  subtract(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y);
  }

  translate(x: number | Vector, y?: number) {
    const other = x instanceof Vector ? x : new Vector(x, y ?? x);
    return new Vector(this.x + other.x, this.y + other.y);
  }

  translateX(x: number) {
    return new Vector(this.x + x, this.y);
  }

  translateY(y: number) {
    return new Vector(this.x, this.y + y);
  }

  scale(x: number | Vector, y?: number) {
    const other = x instanceof Vector ? x : new Vector(x, y ?? x);
    return new Vector(this.x * other.x, this.y * other.y);
  }

  scaleX(x: number) {
    return new Vector(this.x * x, this.y);
  }

  scaleY(y: number) {
    return new Vector(this.x, this.y * y);
  }

  divide(x: number | Vector, y?: number) {
    const other = x instanceof Vector ? x : new Vector(x, y ?? x);
    return new Vector(this.x / other.x, this.y / other.y);
  }

  normalize() {
    return Vector.fromPolar({ length: 1, angle: this.angle() });
  }

  rotate(angle: number) {
    const cos = Vector.cos(angle);
    const sin = Vector.sin(angle);
    return new Vector(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
  }

  dot(other: Vector) {
    return this.x * other.x + this.y * other.y;
  }

  cross(other: Vector) {
    return this.x * other.y - other.x * this.y;
  }

  hadamard(other: Vector) {
    return new Vector(this.x * other.x, this.y * other.y);
  }

  mix(other: Vector, ratio = 0.5) {
    return new Vector(
      this.x + ratio * (other.x - this.x),
      this.y + ratio * (other.y - this.y),
    );
  }

  static random() {
    return new Vector(-1 + 2 * Math.random(), -1 + 2 * Math.random());
  }

  clamp(min: Vector, max: Vector) {
    return new Vector(
      Vector.clamp(this.x, min.x, max.x),
      Vector.clamp(this.y, min.y, max.y),
    );
  }

  clip(min: number, max: number) {
    return Vector.fromPolar({
      length: Vector.clamp(this.length(), min, max),
      angle: this.angle(),
    });
  }

  project(other: Vector) {
    return other.normalize().scale(this.dot(other) / other.length());
  }

  bisect(other: Vector) {
    return this.normalize().add(other.normalize()).normalize();
  }

  static toDeg = 180 / Math.PI;
  static toRad = Math.PI / 180;

  static sin(angle: number) {
    if (Vector.angleUnits === "degrees") angle *= Vector.toRad;
    return Math.sin(angle);
  }

  static cos(angle: number) {
    if (Vector.angleUnits === "degrees") angle *= Vector.toRad;
    return Math.cos(angle);
  }

  static atan2(y: number, x: number) {
    let angle = Math.atan2(y, x);
    if (Vector.angleUnits === "degrees") angle *= Vector.toDeg;
    return angle;
  }

  static clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
}
