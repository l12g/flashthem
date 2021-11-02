import DisplayObject from "../display/DisplayObject";
import Stage from "./Stage";

export default class Renderer {
  private _mouseEvent: MouseEvent;
  private _extraContext: CanvasRenderingContext2D[] = [];
  private _canvas: HTMLCanvasElement;
  private _target: DisplayObject;
  constructor(canvas: HTMLCanvasElement, target: DisplayObject) {
    this._canvas = canvas;
    this._target = target;
  }
  public get context() {
    return this._canvas.getContext("2d");
  }
  public addContext(ctx) {
    this._extraContext.push(ctx);
  }
  public draw(target?: DisplayObject) {
    this.clear();
    this._target.render(this, this._mouseEvent);
    this._mouseEvent = null;
    for (const ctx of this._extraContext) {
      ctx.drawImage(this._canvas, 0, 0);
    }
  }
  public clear() {
    this.context.clearRect(0, 0, this._canvas.width, this._canvas.height);
    for (const ctx of this._extraContext) {
      ctx.clearRect(0, 0, this._canvas.width, this._canvas.height);
    }
  }
}
