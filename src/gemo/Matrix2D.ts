export default class Matrix2D {
  static DEG_TO_RAD: number = Math.PI / 180;
  public a: number;
  public b: number;
  public c: number;
  public d: number;
  public tx: number;
  public ty: number;
  constructor(a = 1, b = 0, c = 0, d = 1, x = 0, y = 0) {
    this.setValues(a, b, c, d, x, y);
  }
  public setValues(a = 1, b = 0, c = 0, d = 1, tx = 0, ty = 0) {
    this.a = a;
    this.b = b;
    this.c = c;
    this.d = d;
    this.tx = tx;
    this.ty = ty;
    return this;
  }
  public get isIdentity() {
    return (
      this.a === 1 &&
      this.b === 0 &&
      this.c === 0 &&
      this.d === 1 &&
      this.tx === 0 &&
      this.ty === 0
    );
  }
  public mult(a, b, c, d, tx, ty) {
    const a1 = this.a;
    const b1 = this.b;
    const c1 = this.c;
    const d1 = this.d;
    if (a != 1 || b != 0 || c != 0 || d != 1) {
      this.a = a1 * a + c1 * b;
      this.b = b1 * a + d1 * b;
      this.c = a1 * c + c1 * d;
      this.d = b1 * c + d1 * d;
    }
    this.tx = a1 * tx + c1 * ty + this.tx;
    this.ty = b1 * tx + d1 * ty + this.ty;
    return this;
  }
  public multBy(a, b, c, d, tx, ty) {
    var a1 = this.a;
    var c1 = this.c;
    var tx1 = this.tx;

    this.a = a * a1 + c * this.b;
    this.b = b * a1 + d * this.b;
    this.c = a * c1 + c * this.d;
    this.d = b * c1 + d * this.d;
    this.tx = a * tx1 + c * this.ty + tx;
    this.ty = b * tx1 + d * this.ty + ty;
    return this;
  }
  public rotate(angle: number) {
    angle = (angle / 180) * Math.PI;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);

    var a1 = this.a;
    var b1 = this.b;

    this.a = a1 * cos + this.c * sin;
    this.b = b1 * cos + this.d * sin;
    this.c = -a1 * sin + this.c * cos;
    this.d = -b1 * sin + this.d * cos;
    return this;
  }
  public translate(x, y) {
    this.tx = x;
    this.ty = y;
    return this;
  }
  public identity() {
    this.a = 1;
    this.b = 0;
    this.c = 0;
    this.d = 1;
    this.tx = 0;
    this.ty = 0;
    return this;
  }
  public append(a, b, c, d, tx, ty) {
    var a1 = this.a;
    var b1 = this.b;
    var c1 = this.c;
    var d1 = this.d;
    if (a != 1 || b != 0 || c != 0 || d != 1) {
      this.a = a1 * a + c1 * b;
      this.b = b1 * a + d1 * b;
      this.c = a1 * c + c1 * d;
      this.d = b1 * c + d1 * d;
    }
    this.tx = a1 * tx + c1 * ty + this.tx;
    this.ty = b1 * tx + d1 * ty + this.ty;
    return this;
  }

  public appendTransform(
    x,
    y,
    scaleX,
    scaleY,
    rotation,
    skewX,
    skewY,
    regX,
    regY
  ) {
    if (rotation % 360) {
      var r = rotation * Matrix2D.DEG_TO_RAD;
      var cos = Math.cos(r);
      var sin = Math.sin(r);
    } else {
      cos = 1;
      sin = 0;
    }

    if (skewX || skewY) {
      // TODO: can this be combined into a single append operation?
      skewX *= Matrix2D.DEG_TO_RAD;
      skewY *= Matrix2D.DEG_TO_RAD;
      this.append(
        Math.cos(skewY),
        Math.sin(skewY),
        -Math.sin(skewX),
        Math.cos(skewX),
        x,
        y
      );
      this.append(
        cos * scaleX,
        sin * scaleX,
        -sin * scaleY,
        cos * scaleY,
        0,
        0
      );
    } else {
      this.append(
        cos * scaleX,
        sin * scaleX,
        -sin * scaleY,
        cos * scaleY,
        x,
        y
      );
    }

    if (regX || regY) {
      // append the registration offset:
      this.tx -= regX * this.a + regY * this.c;
      this.ty -= regX * this.b + regY * this.d;
    }
    return this;
  }
}
