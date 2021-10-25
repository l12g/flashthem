import Stage from "./Stage";

export default class Renderer {
  private _stage: Stage;
  private _mouseEvent: MouseEvent;
  private _extraContext: CanvasRenderingContext2D[] = [];

  constructor(stage: Stage) {
    this._stage = stage;
    this.canvas.addEventListener("click", (e) => {
      this._mouseEvent = e;
      // console.log(e);
    });
    this.canvas.addEventListener("mousemove", (e) => {
      this._mouseEvent = e;
      // console.log(e);
    });
  }
  public get context() {
    return this.canvas.getContext("2d");
  }
  public get canvas() {
    return this._stage.canvas;
  }
  public addContext(ctx) {
    this._extraContext.push(ctx);
  }
  public draw() {
    this.clear();
    this.context.save();
    this._stage.render(this, this._mouseEvent);
    this._mouseEvent = null;
    for (const ctx of this._extraContext) {
      ctx.drawImage(this.canvas, 0, 0);
    }
    this.context.restore();
  }
  public clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    for (const ctx of this._extraContext) {
      ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}
