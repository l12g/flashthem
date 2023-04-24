import Sprite from "./Sprite";

export default class Rect extends Sprite {
  constructor(w: number, h: number, fill: string) {
    super();
    this.width = w;

    this.height = h;
    this.graphics.beginFill(fill);
    this.graphics.drawRect(0, 0, w, h);
  }
}
