// basic complex number operations

export class Complex {
  r: number;
  i: number;

  constructor(r: number, i: number) {
    this.r = r;
    this.i = i;
  }

  add(other: Complex) {
    return new Complex(this.r + other.r, this.i + other.i);
  }

  subtract(other: Complex) {
    return new Complex(this.r - other.r, this.i - other.i);
  }

  multiply(other: Complex) {
    return new Complex(
      this.r * other.r - this.i * other.i,
      this.r * other.i + this.i * other.r,
    );
  }

  divide(other: Complex) {
    const denominator = other.r * other.r + other.i * other.i;
    return new Complex(
      (this.r * other.r + this.i * other.i) / denominator,
      (this.i * other.r - this.r * other.i) / denominator,
    );
  }
}

// calculate coefficients of expanded polynomial from complex roots
// https://stackoverflow.com/questions/33594384
// https://stackoverflow.com/questions/21236788
export const getCoefficients = (roots: Complex[]) => {
  const coefficients: Complex[] = Array(roots.length + 1)
    .fill(null)
    .map(() => new Complex(0, 0));
  coefficients[0] = new Complex(1, 0);
  for (let root = 0; root < roots.length; root++)
    for (let degree = root; degree >= 0; degree--)
      coefficients[degree + 1] = coefficients[degree + 1]!.subtract(
        coefficients[degree]!.multiply(roots[root]!),
      );
  return coefficients;
};
