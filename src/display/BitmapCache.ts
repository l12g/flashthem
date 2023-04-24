import DisplayObject from "./DisplayObject";

export default class BitmapCache {
  private _target: DisplayObject;
  private _canvas: HTMLCanvasElement;
  private _cached: boolean;
  private _needStroke: boolean;
  private _needFill: Boolean;
  public get context() {
    return this._canvas.getContext("2d");
  }
  public get canvas() {
    return this._canvas;
  }
  constructor(target: DisplayObject) {
    this._target = target;
    this._canvas = document.createElement("canvas");
    this._canvas.width = 1;
    this._canvas.height = 1;
  }
  public draw(ctx: CanvasRenderingContext2D) {
    const { width, height } = this._target;
    if (!this._cached) {
      this.update();
    }
    ctx.drawImage(this._canvas, 0, 0, width, height, 0, 0, width, height);
  }
  private afterDraw(ctx: CanvasRenderingContext2D) {
    this._needFill && ctx.fill();
    this._needStroke && ctx.stroke();
  }
  public reset() {
    this._cached = false;
  }
  private update() {
    const ctx = this.context;
    ctx.save();
    const target = this._target;
    this._cached = true;
    const commands = target.graphics.commands;
    const { width, height } = this._target;
    this._canvas.width = width;
    this._canvas.height = height;
    this.context.clearRect(0, 0, width, height);
    ctx.globalAlpha = target.parent
      ? target.parent.alpha * target.alpha
      : target.alpha;

    commands.forEach((c) => {
      c.call(this, ctx) && this.afterDraw(ctx);
    });
    ctx.restore();
  }
}
