import DisplayObject from "../display/DisplayObject";
import Stage from "./Stage";

export default class Renderer {
  private _extraContext: CanvasRenderingContext2D[] = [];
  private _canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement) {
    this._canvas = canvas;
  }
  public get context() {
    return this._canvas.getContext("2d");
  }
  public addContext(ctx) {
    this._extraContext.push(ctx);
  }
  public render(target: DisplayObject, evt: MouseEvent, elapsed: number) {
    this.clear();
    this.context.save();
    this.context.scale(Stage.DPR, Stage.DPR);
    target.render(this, evt, elapsed);
    for (const ctx of this._extraContext) {
      ctx.drawImage(this._canvas, 0, 0);
    }
    this.context.restore();
  }
  public clear() {
    this.context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (const ctx of this._extraContext) {
      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }
}
