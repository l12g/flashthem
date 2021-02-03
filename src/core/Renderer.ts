import Stage from "../display/Stage";

export default class Renderer {
  private _stage: Stage;
  private _mouseEvent: MouseEvent;
  private _offCanvas: OffscreenCanvas;
  constructor(stage: Stage) {
    this._stage = stage;
    this._offCanvas = new OffscreenCanvas(
      this.canvas.width,
      this.canvas.height
    );
    this.context.lineWidth = 0;
    this.context.strokeStyle = null;
    this.canvas.addEventListener("click", (e) => {
      this._mouseEvent = e;
    });
  }
  private get offContext() {
    return this._offCanvas.getContext("2d");
  }
  public get context() {
    return this._offCanvas.getContext("2d");
  }
  public get displayContext() {
    return this.canvas.getContext("2d");
  }
  public get canvas() {
    return this._stage.canvas;
  }
  public draw() {
    this.clear();
    for (let i = 0, len = this._stage.children.length; i < len; i++) {
      const child = this._stage.children[i];
      child.draw(this, this._mouseEvent);
    }
    this._mouseEvent = null;
    this.displayContext.drawImage(this._offCanvas, 0, 0);
  }
  public clear() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.displayContext.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
