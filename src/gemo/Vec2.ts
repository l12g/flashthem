import Matrix2D from "./Matrix2D";

export default class Vec2 {
  public x: number = 0;
  public y: number = 0;

  public get length() {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }
  public set length(v: number) {
    this.x = Math.cos(this.angle) * v;
    this.y = Math.sin(this.angle) * v;
  }

  public get angle() {
    return Math.atan2(this.y, this.x);
  }
  constructor(x: number = 0, y: number = 0) {
    this.x = x;
    this.y = y;
  }
  clone() {
    return new Vec2(this.x, this.y);
  }
  zero() {
    this.x = 0;
    this.y = 0;
    return this;
  }
  isZero() {
    return this.x === 0 && this.y === 0;
  }
  public reverse() {
    this.x *= -1;
    this.y *= -1;
    return this;
  }
  public add(v: Vec2) {
    return new Vec2(this.x + v.x, this.y + v.y);
  }
  public addxy(x: number, y: number) {
    return new Vec2(this.x + x, this.y + y);
  }
  public subtract(v: Vec2) {
    return new Vec2(this.x - v.x, this.y - v.y);
  }
  public multiply(v: number) {
    return new Vec2(this.x * v, this.y * v);
  }
  public divide(v: number) {
    return new Vec2(this.x / v, this.y / v);
  }
  public equals(v: Vec2) {
    return this.x === v.x && this.y === v.y;
  }
  public toString() {
    return `Vec2(${this.x},${this.y})`;
  }
  transform(mtx: Matrix2D) {
    this.x = mtx.a * this.x + mtx.c * this.y;
    this.y = mtx.b * this.x + mtx.d * this.y;
    return this;
  }
}
