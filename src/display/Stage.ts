import Renderer from "../core/Renderer";
import { DisplayObject } from "./DisplayObject";
import { ENTER_FRAME } from "../event/Event";
export default class Stage extends DisplayObject {
  private _renderer: Renderer;
  public canvas: HTMLCanvasElement;
  constructor(canvas: HTMLCanvasElement, w?: number, h?: number) {
    super();
    this.stage = this;
    this.width = w;
    this.height = h;
    this.canvas = canvas;
    this._renderer = new Renderer(this);
    this.update();
  }
  private update() {
    const fn = () => {
      this.draw();
      this.emit(ENTER_FRAME);
      requestAnimationFrame(fn);
    };
    fn();
  }
  public draw() {
    this._renderer.draw();
  }
}
