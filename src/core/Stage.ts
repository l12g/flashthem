import Renderer from "./Renderer";
import Engine, { IEngine } from "./Engine";
import DisplayObjectContainer from "../display/DisplayObjectContainer";
import { Fps } from "..";
export default class Stage extends DisplayObjectContainer implements IEngine {
  static DPR: number = 1;
  public fps: number = 60;
  public mouseX: number;
  public mouseY: number;
  public debug: boolean = true;
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
    Stage.DPR = value;
    this._dpr = value;
    this.adjustDpr();
  }
  constructor(el: HTMLCanvasElement | string, dpr?: number) {
    super();
    const canvas: HTMLCanvasElement = (this.canvas =
      typeof el === "string" ? document.querySelector(el) : el);
    this.width = canvas.width;
    this.height = canvas.height;
    this.dpr = dpr || window.devicePixelRatio;
    this._renderer = new Renderer(canvas);
    this._engine = new Engine(this);
    const mouseHandler = this.onMouse.bind(this);
    canvas.addEventListener("mousemove", mouseHandler);
    canvas.addEventListener("click", mouseHandler);
    canvas.addEventListener("mouseup", mouseHandler);
    canvas.addEventListener("mousedown", mouseHandler);
    canvas.addEventListener("touchmove", this.onTouchMove.bind(this));
    if (this.debug) {
      this.addChild(new Fps());
    }
    this.on("enter-frame", () => {
      if (!this.debug) return;
      this.graphics.clear();
      this.graphics.lineStyle(1, "red");
      this.children.forEach((c) => {
        const aabb = c.aabb;
        this.graphics.drawRect(aabb.x, aabb.y, aabb.w, aabb.h);
      });
    });
  }
  private onMouse(e: MouseEvent) {
    this._mouseEvent = e;
    this.mouseX = e.offsetX;
    this.mouseY = e.offsetY;
  }
  private onTouchMove(e: TouchEvent) {}
  private adjustDpr() {
    const canvas = this.canvas;
    const oldWidth = this.width;
    const oldHeight = this.height;
    console.log(oldWidth, oldHeight, this.dpr);
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
}
