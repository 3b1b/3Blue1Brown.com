// https://gist.github.com/vincerubinetti/52ec86385ef42f1cd205ad4783a87d5d

export class Vector {
  /** x-component */
  x: number;
  /** y-component */
  y: number;
  /** z-component */
  z: number;

  // ---------------------------------------------------------------------------
  // create from
  // ---------------------------------------------------------------------------

  /** new vector */
  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  /** create vector from object format */
  static fromObject(object: { x: number; y: number; z?: number }) {
    return new Vector(object.x, object.y, object.z ?? 0);
  }

  /** create vector from array format */
  static fromArray(array: [number, number] | [number, number, number]) {
    return new Vector(...array);
  }

  /** run function for each component to create vector */
  static fromMap(func: (key: "x" | "y" | "z", index: 0 | 1 | 2) => number) {
    return new Vector(func("x", 0), func("y", 1), func("z", 2));
  }

  /** create vector with random components */
  static fromRandom(min = -1, max = 1) {
    return Vector.fromMap(() => Math.random() * (max - min) + min);
  }

  // ---------------------------------------------------------------------------
  // export to
  // ---------------------------------------------------------------------------

  /** convert vector to object format */
  toObject() {
    return { x: this.x, y: this.y, z: this.z };
  }

  /** convert vector to array format */
  toArray(dimension: 2): [number, number];
  toArray(dimension?: 3): [number, number, number];
  toArray(dimension = 3) {
    return [this.x, this.y, this.z].slice(0, dimension);
  }

  /** convert vector to string */
  toString(
    dimension: Parameters<Vector["toArray"]>[0] = 3,
    /** number of decimal places */
    precision = 3,
    /** component joiner */
    separator = ",",
  ) {
    return this.toArray(dimension)
      .map((value) => value.toFixed(precision).replace(/\.*0+$/, ""))
      .join(separator);
  }

  // ---------------------------------------------------------------------------
  // component-wise operations with other vector
  // ---------------------------------------------------------------------------

  /** does this vector equal other vector */
  equals(other: Vector) {
    return this.x == other.x && this.y == other.y && this.z == other.z;
  }

  /** add this vector to other vector */
  add(other: Vector) {
    return new Vector(this.x + other.x, this.y + other.y, this.z + other.z);
  }

  /** subtract other vector from this vector */
  subtract(other: Vector) {
    return new Vector(this.x - other.x, this.y - other.y, this.z - other.z);
  }

  /** multiply this vector by other vector */
  multiply(other: Vector) {
    return new Vector(this.x * other.x, this.y * other.y, this.z * other.z);
  }

  /** divide this vector by other vector */
  divide(other: Vector) {
    return new Vector(this.x / other.x, this.y / other.y, this.z / other.z);
  }

  /** get smaller of this vector and other vector */
  min(other: Vector) {
    return Vector.min([this, other]);
  }

  /** get larger of this vector and other vector */
  max(other: Vector) {
    return Vector.max([this, other]);
  }

  // ---------------------------------------------------------------------------
  // get/set lengths/angles
  // ---------------------------------------------------------------------------

  /** get length of this vector */
  length(): number;
  /** set length of this vector */
  length(length: number): Vector;
  length(length?: number) {
    if (length === undefined) return Math.hypot(this.x, this.y, this.z);
    else return this.normalize().scale(length);
  }

  /** normalize this vector to length 1 */
  normalize() {
    return this.scale(1 / (this.length() || Infinity));
  }

  /** add to or subtract from this vector's length */
  extend(length: number) {
    return this.length(this.length() + length);
  }

  /** limit length of this vector between min/max */
  clip(min: number, max: number) {
    return this.length(Vector.clamp(this.length(), min, max));
  }

  /** distance from this vector to other vector */
  distance(other: Vector) {
    return other.subtract(this).length();
  }

  /** angle from this vector to other vector */
  angle(other: Vector) {
    return Vector.acos(this.dot(other) / (this.length() * other.length()));
  }

  // ---------------------------------------------------------------------------
  // transform operations
  // ---------------------------------------------------------------------------

  /** add to or subtract scalar from this vector's x/y/z component(s) */
  translate(x: number, y = 0, z = 0) {
    return this.add(new Vector(x, y, z));
  }

  /** add to or subtract scalar from this vector's x component */
  translateX(x: number) {
    return this.add(new Vector(x, 0, 0));
  }

  /** add to or subtract scalar from this vector's y component */
  translateY(y: number) {
    return this.add(new Vector(0, y, 0));
  }

  /** add to or subtract scalar from this vector's z component */
  translateZ(z: number) {
    return this.add(new Vector(0, 0, z));
  }

  /** multiply this vector's x/y/z component(s) by scalar(s) */
  scale(x: number, y = x, z = x) {
    return this.multiply(new Vector(x, y, z));
  }

  /** multiply this vector's x component by scalar */
  scaleX(x: number) {
    return this.multiply(new Vector(x, 1, 1));
  }

  /** multiply this vector's y component by scalar */
  scaleY(y: number) {
    return this.multiply(new Vector(1, y, 1));
  }

  /** multiply this vector's z component by scalar */
  scaleZ(z: number) {
    return this.multiply(new Vector(1, 1, z));
  }

  /** rotate this vector around arbitrary axis by scalar */
  rotate(angle: number, axis = new Vector(0, 0, 1)) {
    axis = axis.normalize();
    // rodrigues' formula
    return this.scale(Vector.cos(angle))
      .add(axis.cross(this).scale(Vector.sin(angle)))
      .add(axis.scale(axis.dot(this) * (1 - Vector.cos(angle))));
  }

  /** rotate this vector around x axis by scalar */
  rotateX(angle: number) {
    return this.rotate(angle, new Vector(1, 0, 0));
  }

  /** rotate this vector around y axis by scalar */
  rotateY(angle: number) {
    return this.rotate(angle, new Vector(0, 1, 0));
  }

  /** rotate this vector around z axis by scalar */
  rotateZ(angle: number) {
    return this.rotate(angle, new Vector(0, 0, 1));
  }

  // ---------------------------------------------------------------------------
  // common vector/geometric operations
  // ---------------------------------------------------------------------------

  /** dot product of this vector with other vector */
  dot(other: Vector) {
    return this.x * other.x + this.y * other.y + this.z * other.z;
  }

  /** cross product of this vector with other vector */
  cross(other: Vector, dimension: 2): number;
  cross(other: Vector, dimension?: 3): Vector;
  cross(other: Vector, dimension = 3) {
    if (dimension === 3)
      return new Vector(
        this.y * other.z - this.z * other.y,
        this.z * other.x - this.x * other.z,
        this.x * other.y - this.y * other.x,
      );
    else return this.x * other.y - this.y * other.x;
  }

  /** hadamard product of this vector with other vector */
  hadamard(other: Vector) {
    return new Vector(this.x * other.x, this.y * other.y, this.z * other.z);
  }

  /** reflect this vector across plane defined by axis normal */
  reflect(axis = new Vector(0, 0, 1)) {
    axis = axis.normalize();
    return this.subtract(axis.scale(2 * this.dot(axis)));
  }

  /** project this vector onto plane defined by axis normal */
  project(axis = new Vector(0, 0, 1)) {
    axis = axis.normalize();
    return this.subtract(axis.scale(this.dot(axis)));
  }

  /** perspective projection */
  perspective(focalLength = 1, axis = new Vector(0, 0, 1)) {
    return this.project(axis).scale(
      focalLength / Math.max(focalLength + this.z, 0),
    );
  }

  // ---------------------------------------------------------------------------
  // common component-wise math operations
  // ---------------------------------------------------------------------------

  /** apply floor to each component of this vector */
  floor() {
    return this.map(Math.floor);
  }

  /** apply ceil to each component of this vector */
  ceil() {
    return this.map(Math.ceil);
  }

  /** apply round to each component of this vector */
  round() {
    return this.map(Math.round);
  }

  /** apply abs to each component of this vector */
  abs() {
    return this.map(Math.abs);
  }

  /** raise each component of this vector to power */
  power(power = 2) {
    return new Vector(this.x ** power, this.y ** power, this.z ** power);
  }

  /** raise base to power of each component of this vector */
  exp(base = Math.E) {
    return new Vector(base ** this.x, base ** this.y, base ** this.z);
  }

  /** linear-interpolate this vector with other vector by amount [0,1] */
  mix(other: Vector, percent = 0.5) {
    return new Vector(
      this.x + percent * (other.x - this.x),
      this.y + percent * (other.y - this.y),
      this.z + percent * (other.z - this.z),
    );
  }

  /** limit each component of this vector between corresponding components of min/max vectors */
  clamp(min: Vector, max: Vector) {
    return new Vector(
      Vector.clamp(this.x, min.x, max.x),
      Vector.clamp(this.y, min.y, max.y),
      Vector.clamp(this.z, min.z, max.z),
    );
  }

  /** apply function to each component of this vector */
  map(func: (value: number, key: "x" | "y" | "z", index: 0 | 1 | 2) => number) {
    return new Vector(
      func(this.x, "x", 0),
      func(this.y, "y", 1),
      func(this.z, "z", 2),
    );
  }

  // ---------------------------------------------------------------------------
  // multi-vector operations
  // ---------------------------------------------------------------------------

  /** smallest x/y/z of list of vectors */
  static min(vectors: Vector[]) {
    let x = Infinity;
    let y = Infinity;
    let z = Infinity;
    // stack efficient, avoid spread args
    for (const vector of vectors) {
      if (vector.x < x) x = vector.x;
      if (vector.y < y) y = vector.y;
      if (vector.z < z) z = vector.z;
    }
    return new Vector(x, y, z);
  }

  /** largest x/y/z of list of vectors */
  static max(vectors: Vector[]) {
    let x = -Infinity;
    let y = -Infinity;
    let z = -Infinity;
    // stack efficient, avoid spread args
    for (const vector of vectors) {
      if (vector.x > x) x = vector.x;
      if (vector.y > y) y = vector.y;
      if (vector.z > z) z = vector.z;
    }
    return new Vector(x, y, z);
  }

  // ---------------------------------------------------------------------------
  // utility
  // ---------------------------------------------------------------------------

  /** angle unit option */
  static angleUnit: "radians" | "degrees" = "degrees";

  /** convert radians to degrees */
  static toDeg = (angle: number) => angle * (180 / Math.PI);
  /** convert degrees to radians */
  static toRad = (angle: number) => angle * (Math.PI / 180);

  /** sine of angle */
  static sin(angle: number) {
    if (Vector.angleUnit === "degrees") angle = Vector.toRad(angle);
    return Math.sin(angle);
  }

  /** cosine of angle */
  static cos(angle: number) {
    if (Vector.angleUnit === "degrees") angle = Vector.toRad(angle);
    return Math.cos(angle);
  }

  /** arccosine of value */
  static acos(value: number) {
    let angle = Math.acos(value);
    if (Vector.angleUnit === "degrees") angle = Vector.toDeg(angle);
    return angle;
  }

  /** keep value between min and max */
  static clamp(value: number, min: number, max: number) {
    return Math.max(min, Math.min(max, value));
  }
}
