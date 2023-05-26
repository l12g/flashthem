import Renderer from "../core/Renderer";
import DisplayObject from "./DisplayObject";

export default class Fps extends DisplayObject {
  private _frame: number = 0;
  private _t: number = 0;
  constructor() {
    super();
    this.width = 50;
    this.height = 20;
    this.draw();
  }
  private draw() {
    this.graphics.clear();
    this.graphics.beginFill("#000");
    this.graphics.drawRect(0, 0, 50, 20);
    this.graphics.beginFill("#fff");
    this.graphics.fontStyle("18px", "center", "middle");
    this.graphics.drawText("fps:" + this._frame, 25, 10, "18px");
  }
  public onRender(render: Renderer, evt: MouseEvent, elapsed: number) {
    this._t += elapsed;
    this._frame++;
    if (this._t >= 1000) {
      this.draw();
      this._t = 0;
      this._frame = 0;
    }
  }
}
