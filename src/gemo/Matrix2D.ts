const DEG_TO_RAD = Math.PI / 180;
export default class Matrix2D {
  a = 1;
  b = 0;
  c = 0;
  d = 1;
  tx = 0;
  ty = 0;

  rotate(angel: number) {
    const deg = angel * DEG_TO_RAD;
    this.a = Math.cos(deg);
    this.b = -Math.sin(deg);
    this.c = Math.sin(deg);
    this.d = Math.cos(deg);
    return this;
  }
  scale(x: number, y: number) {
    this.a *= x;
    this.b *= y;
    this.c *= x;
    this.d *= y;
    return this;
  }
  mult(x: number, y: number) {
    const { a, b, c, d } = this;
    return [a * x + b * y + this.tx, c * x + d * y + this.ty];
  }

  translate(x: number, y: number) {
    this.tx = x;
    this.ty = y;
    return this;
  }
  toString() {
    console.log(`
        ${this.a}--${this.c}--${this.tx}
        ${this.b}--${this.d}--${this.ty}
        `);
  }
}
