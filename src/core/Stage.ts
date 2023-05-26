import DisplayObjectContainer from "../display/DisplayObjectContainer";
import Fps from "../display/Fps";
import Grid from "../display/Grid";
import Sprite from "../display/Sprite";
import Engine, { IEngine } from "./Engine";
import Renderer from "./Renderer";
export default class Stage extends DisplayObjectContainer implements IEngine {
  static context: CanvasRenderingContext2D;
  public fps: number = 60;
  public mouseX: number;
  public mouseY: number;
  public readonly canvas: HTMLCanvasElement;
  private _renderer: Renderer;
  private _engine: Engine;
  private _mouseEvent: MouseEvent;
  private _dpr: number = 1;
  public get dpr(): number {
    return this._dpr;
  }
  public set dpr(value: number) {
    value = Math.max(1, value);
    this._dpr = value;
    this.adjustDpr();
  }

  public get context() {
    return this._renderer.context;
  }
  private mouseHandler = (e: MouseEvent) => {
    this._mouseEvent = e;
    this.mouseX = e.offsetX;
    this.mouseY = e.offsetY;
  };
  constructor(el: HTMLCanvasElement | string, dpr?: number) {
    super();
    const canvas: HTMLCanvasElement = (this.canvas =
      typeof el === "string" ? document.querySelector(el) : el);
    this.width = canvas.width;
    this.height = canvas.height;
    this.dpr = dpr || window.devicePixelRatio;
    this._renderer = new Renderer(canvas, this._dpr);
    this._engine = new Engine(this);
    canvas.addEventListener("mousemove", this.mouseHandler);
    canvas.addEventListener("click", this.mouseHandler);
    canvas.addEventListener("mouseup", this.mouseHandler);
    canvas.addEventListener("mousedown", this.mouseHandler);

    Stage.context = this._renderer.context;
  }
  public debug(v: boolean | { grid?: boolean }) {
    if (v) {
      const box = new Sprite();
      this.addChild(new Fps());
      const g = new Grid();
      g.width = this.width;
      g.height = this.height;
      this.addChildAt(g, 0);
      this.addChild(box);
      const draw = (c) => {
        if (c === box || c === g) {
          return;
        }
        const { x, y, w, h } = c.aabb;
        box.graphics.drawRect(x, y, w, h);
        box.graphics.drawCircle(c.x, c.y, 3);
        
        if (c.children) {
          c.children.forEach(draw);
        }
      };
      if ((v as any).grid) {
        this.on("enter-frame", () => {
          box.graphics.clear();
          box.graphics.lineStyle(1, "red");
          this.children.forEach(draw);
        });
      }
    }
  }
  private adjustDpr() {
    const canvas = this.canvas;
    const oldWidth = this.width;
    const oldHeight = this.height;
    canvas.width = oldWidth * this.dpr;
    canvas.height = oldHeight * this.dpr;
    canvas.style.width = oldWidth + "px";
    canvas.style.height = oldHeight + "px";
  }
  public addCanvas(canvas: HTMLCanvasElement) {
    this._renderer.addContext(canvas.getContext("2d"));
  }
  onEngine(elapsed: number) {
    this._renderer.render(this, this._mouseEvent, elapsed);
    this._mouseEvent = null;
  }
  public flush() {
    this._renderer.render(this, null, 0);
  }
  public override remove() {
    return this;
  }
  public override dispose() {
    super.dispose();
    this._engine.stop();
    const { canvas } = this;
    canvas.addEventListener("mousemove", this.mouseHandler);
    canvas.addEventListener("click", this.mouseHandler);
    canvas.addEventListener("mouseup", this.mouseHandler);
    canvas.addEventListener("mousedown", this.mouseHandler);
  }
}
