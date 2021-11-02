import Graphics from "../core/Graphics";
import Renderer from "../core/Renderer";
import EventDispatcher from "../event/Dispatcher";
import DisplayObjectContainer from "./DisplayObjectContainer";

type BlendMode =
  | "source-over"
  | "source-in"
  | "source-out"
  | "source-atop"
  | "destination-over"
  | "destination-in"
  | "destination-out"
  | "destination-atop"
  | "lighter"
  | "copy"
  | "xor"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

type AABB = [number, number, number, number];
type Vertex = [number, number];
export default abstract class DisplayObject extends EventDispatcher {
  public name: string;
  public mouseEnable: boolean = false;
  public visible: boolean = true;
  public blendMode: BlendMode;
  public x: number = 0;
  public y: number = 0;

  public width: number = 0;
  public height: number = 0;

  public pivotX: number = 0.5;
  public pivotY: number = 0.5;

  public scaleX: number = 1;
  public scaleY: number = 1;

  public rotation: number = 0;
  public alpha: number = 1;

  private _parent: DisplayObjectContainer;
  public get parent() {
    return this._parent;
  }
  public set parent(v: DisplayObjectContainer) {
    this._parent = v;
  }

  private _graphics: Graphics;
  public get graphics(): Graphics {
    return this._graphics || (this._graphics = new Graphics(this));
  }

  constructor() {
    super();
  }

  public get globalX() {
    let x = this.x;
    let p = this.parent;
    while (p) {
      x += p.x;
      p = p.parent;
    }
    return x;
  }
  public get globalY() {
    let y = this.y;
    let p = this.parent;
    while (p) {
      y += p.y;
      p = p.parent;
    }
    return y;
  }
  public get globalRotation() {
    let r = this.rotation;
    let p = this.parent;
    while (p) {
      r += p.rotation;
      p = p.parent;
    }
    return r;
  }

  public render(render: Renderer, evt?: MouseEvent) {
    if (!this.visible) {
      return;
    }
    this.emit("enter-frame", render);
    this.graphics.draw(render, evt);
    this.onRender(render, evt);
    this.emit("exit-frame", render);
  }

  public remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }
  protected onRender(render: Renderer, evt?: MouseEvent) {}
  public hitTest(target: DisplayObject) {
    const aabb1 = this.aabb();
    const aabb2 = target.aabb();
    const x = Math.abs(aabb1[0] - aabb2[0]) < aabb1[2];
    const y = Math.abs(aabb1[1] - aabb2[1]) < aabb1[3];
    // console.log(aabb1[0] - aabb2[0], aabb1[2]);
    return x && y;
  }
  public aabb(): AABB {
    const [p1, p2, p3, p4] = this.vertex();
    const minx = Math.min(p1[0], p2[0], p3[0], p4[0]);
    const miny = Math.min(p1[1], p2[1], p3[1], p4[1]);
    const maxx = Math.max(p1[0], p2[0], p3[0], p4[0]);
    const maxy = Math.max(p1[1], p2[1], p3[1], p4[1]);
    return [minx, miny, Math.abs(maxx - minx), Math.abs(maxy - miny)];
  }

  public vertex(): Vertex[] {
    const gr = (Math.PI / 180) * this.globalRotation;
    const hw = this.width / 2;
    const hh = this.height / 2;
    const a = Math.cos(gr);
    const b = Math.sin(gr);
    const c = -Math.sin(gr);
    const d = Math.cos(gr);
    const p1: Vertex = [
      a * hw + c * hh + this.globalX,
      b * hw + d * hh + this.globalY,
    ];
    const p2: Vertex = [
      -a * hw + c * hh + this.globalX,
      -b * hw + d * hh + this.globalY,
    ];
    const p3: Vertex = [
      -a * hw - c * hh + this.globalX,
      -b * hw - d * hh + this.globalY,
    ];
    const p4: Vertex = [
      a * hw - c * hh + this.globalX,
      b * hw - d * hh + this.globalY,
    ];
    return [p1, p2, p3, p4];
  }
}
