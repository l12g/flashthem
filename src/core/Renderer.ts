import DisplayObject from "../display/DisplayObject";

export default class Renderer {
  public context: CanvasRenderingContext2D;
  private _extraContext: CanvasRenderingContext2D[] = [];
  private _canvas: HTMLCanvasElement;
  private _dpr: number = 1;
  constructor(canvas: HTMLCanvasElement, dpr: number = 1) {
    this._canvas = canvas;
    this._dpr = dpr;
    this.context = this._canvas.getContext("2d");
  }
  public addContext(ctx) {
    this._extraContext.push(ctx);
  }
  public render(target: DisplayObject, evt: MouseEvent, elapsed: number) {
    this.clear();
    this.context.save();
    this.context.scale(this._dpr, this._dpr);
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
