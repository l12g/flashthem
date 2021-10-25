import Sprite from "./Sprite";

export default class Rect extends Sprite {
  constructor(w: number, h: number, fill: string) {
    super();
    this.width = w;

    this.height = h;
    this.graphics.beginFill(fill);
    this.graphics.drawRect(
      -this.width * this.pivotX,
      -this.height * this.pivotY,
      w,
      h
    );
  }
}
