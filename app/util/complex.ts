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
