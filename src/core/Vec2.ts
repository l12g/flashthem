import { isNum } from "../utils/index";

export default class Vec2 {
  public x: number = 0;
  public y: number = 0;
  constructor(x: number = 0, y: number = 0) {
    this.set(x, y);
  }
  public set(x?: number, y?: number) {
    this.x = isNum(x) ? x : this.x;
    this.y = isNum(y) ? y : this.y;
  }
}
