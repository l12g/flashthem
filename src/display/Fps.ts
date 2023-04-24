import { TextField } from "..";
import Renderer from "../core/Renderer";

export default class Fps extends TextField {
  private _frame: number = 0;
  private _t: number = 0;
  constructor() {
    super("fps:0");
    this.font = "12px _sans";
    this.graphics.beginFill('red');
  }
  public onRender(render: Renderer, evt: MouseEvent, elapsed: number) {
    super.onRender(render, evt, elapsed);
    this._t += elapsed;
    this._frame++;
    if (this._t > 1000) {
      this.text = "fps:" + this._frame;
      this._t = 0;
      this._frame = 0;
    }
  }
}
