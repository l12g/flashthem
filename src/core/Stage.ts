import Renderer from "./Renderer";
import Engine, { IEngine } from "./Engine";
import DisplayObjectContainer from "../display/DisplayObjectContainer";
export default class Stage extends DisplayObjectContainer implements IEngine {
  public fps: number = 60;
  public readonly canvas: HTMLCanvasElement;
  private _renderer: Renderer;
  private _engine: Engine;
  constructor(canvas: HTMLCanvasElement, w?: number, h?: number) {
    super();
    this.canvas = canvas;
    this._renderer = new Renderer(canvas, this);
    this._engine = new Engine(this);
    this.width = this.canvas.width;
    this.height = this.canvas.height;
  }
  public addCanvas(canvas: HTMLCanvasElement) {
    this._renderer.addContext(canvas.getContext("2d"));
  }
  onEngine(elapsed: number) {
    this._renderer.draw();
  }
  public calcSize() {
    // stage.width=canvas.width
  }
  public flush() {
    this._renderer.draw(this);
  }
}
