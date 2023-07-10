import { Stage } from "..";
import Graphics from "../core/Graphics";
import Renderer from "../core/Renderer";
import EventDispatcher from "../event/Dispatcher";
import Matrix2D from "../gemo/Matrix2D";
import Vec2 from "../gemo/Vec2";
import { getType } from "../utils";
import BitmapCache from "./BitmapCache";
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

type AABB = { x: number; y: number; w: number; h: number };
export default abstract class DisplayObject extends EventDispatcher {
  public shadow: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  private _mtx: Matrix2D;
  private _bitmapCache: BitmapCache;
  private _filters = [];
  public get filters() {
    return this._filters;
  }
  public set filters(v: any[]) {
    this._filters = v;
  }
  public get bitmapCache(): BitmapCache {
    return this._bitmapCache;
  }
  public set bitmapCache(value: BitmapCache) {
    this._bitmapCache = value;
  }
  private _useBitmapCache: boolean;
  public get useBitmapCache(): boolean {
    return this._useBitmapCache;
  }
  public set useBitmapCache(value: boolean) {
    if (value) {
      this._bitmapCache = this._bitmapCache || new BitmapCache(this);
    }
    this._useBitmapCache = value;
  }
  private _x: number = 0;
  public get x(): number {
    return this._x;
  }
  public set x(value: number) {
    this._x = value;
  }
  private _y: number = 0;
  public get y(): number {
    return this._y;
  }
  public set y(value: number) {
    this._y = value;
  }
  private _scaleX: number = 1;
  public get scaleX(): number {
    return this._scaleX;
  }
  public set scaleX(value: number) {
    this._scaleX = value;
  }
  private _scaleY: number = 1;
  public get scaleY(): number {
    return this._scaleY;
  }
  public set scaleY(value: number) {
    this.updateBitmapCache();
    this._scaleY = value;
  }
  private _width: number = 0;
  public get width(): number {
    return this._width;
  }
  public set width(value: number) {
    this._width = value;
  }
  private _height: number = 0;
  public get height(): number {
    return this._height;
  }
  public set height(value: number) {
    this._height = value;
  }
  private _rotation: number = 0;
  public get rotation(): number {
    return this._rotation;
  }
  public set rotation(value: number) {
    this._rotation = value;
  }
  private _pivotX: number = 0;
  public get pivotX(): number {
    return this._pivotX;
  }
  public set pivotX(value: number) {
    this._pivotX = value;
  }
  private _pivotY: number = 0;
  public get pivotY(): number {
    return this._pivotY;
  }
  public set pivotY(value: number) {
    this._pivotY = value;
  }

  private _skewX: number = 0;
  public get skewX(): number {
    return this._skewX;
  }
  public set skewX(value: number) {
    this._skewX = value;
  }
  private _skewY: number = 0;
  public get skewY(): number {
    return this._skewY;
  }
  public set skewY(value: number) {
    this._skewY = value;
  }

  public snapToPixel: boolean = true;
  public _parent?: DisplayObjectContainer;
  public get parent() {
    return this._parent;
  }
  public set parent(v: DisplayObjectContainer) {
    if (v && v.constructor === DisplayObjectContainer) {
      throw new Error(
        `parent must be instance of DisplayObjectContainer,got ${getType(v)}`
      );
    }
    this._parent = v;
  }

  public name: string;
  public mouseEnable: boolean = false;
  public visible: boolean = true;
  public blendMode: BlendMode;
  private _alpha: number = 1;
  public get alpha(): number {
    return this._alpha;
  }
  public set alpha(value: number) {
    const eq = value === this._alpha;
    this._alpha = value;
    if (!eq) {
      this.updateBitmapCache();
    }
  }
  public readonly graphics: Graphics;

  constructor() {
    super();
    this.graphics = new Graphics(this);
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
  public get stage(): Stage | null {
    let p = this.parent;
    while (p) {
      if (p.constructor === Stage) {
        return p;
      }
      p = p.parent;
    }
    return null;
  }

  private drawCache() {}

  public render(render: Renderer, evt: MouseEvent, elapsed: number) {
    if (!this.visible) {
      return;
    }
    this.emit("enter-frame", render);
    render.context.save();
    if (this.useBitmapCache) {
      this.drawCache();
    }
    this.graphics.draw(render.context, evt, () => {
      this.onRender(render, evt, elapsed);
    });

    render.context.restore();
    this.emit("exit-frame", render);
  }

  public remove() {
    this.parent && this.parent.removeChild(this);
    return this;
  }
  protected onRender(render: Renderer, evt: MouseEvent, elapsed: number) {}

  /**
   * 矩形碰撞检测
   * @param target
   * @returns
   */
  public hitTestObject(target: DisplayObject): boolean {
    const bound1 = this.aabb;
    const bound2 = target.aabb;
    const axs1 = bound1.x;
    const axs2 = bound1.x + bound1.w;

    const bxs1 = bound2.x;
    const bxs2 = bound2.x + bound2.w;

    const ays1 = bound1.y;
    const ays2 = bound1.y + bound1.h;

    const bys1 = bound2.y;
    const bys2 = bound2.y + bound2.h;

    const x =
      Math.max(axs1, axs2, bxs1, bxs2) - Math.min(axs1, axs2, bxs1, bxs2) <
      bound1.w + bound2.w;

    const y =
      Math.max(ays1, ays2, bys1, bys2) - Math.min(ays1, ays2, bys1, bys2) <
      bound1.h + bound2.h;

    return x && y;
  }

  /**
   *
   * @param number x x坐标
   * @param number y y坐标
   * @returns
   */
  public hitTestPoint(x: number, y: number) {
    const aabb = this.aabb;
    return (
      x > aabb.x && x < aabb.x + aabb.w && y > aabb.y && y < aabb.y + aabb.h
    );
  }

  /**
   *
   * 包围盒
   * @returns
   */
  public get aabb(): AABB {
    const [p1, p2, p3, p4] = this.vertex;
    const minx = Math.min(p1.x, p2.x, p3.x, p4.x);
    const miny = Math.min(p1.y, p2.y, p3.y, p4.y);
    const maxx = Math.max(p1.x, p2.x, p3.x, p4.x);
    const maxy = Math.max(p1.y, p2.y, p3.y, p4.y);
    return {
      x: minx,
      y: miny,
      w: Math.abs(maxx - minx),
      h: Math.abs(maxy - miny),
    };
  }

  /**
   * 获取4个顶点
   */
  public get vertex(): Vec2[] {
    const { width, height, pivotX, pivotY } = this;
    const ox = width * pivotX * -1;
    const oy = height * pivotY * -1;
    const p1 = new Vec2(ox, oy);
    const p2 = new Vec2(ox + width, oy);
    const p3 = new Vec2(ox + width, oy + height);
    const p4 = new Vec2(ox, oy + height);
    const mtx = new Matrix2D();
    mtx
      .translate(this.globalX, this.globalY)
      .rotate(this.rotation)
      .scale(this.scaleX, this.scaleY);

    return [p1, p2, p3, p4].map((o) => {
      const [x, y] = mtx.mult(o.x, o.y);
      return new Vec2(x, y);
    });
  }

  private updateBitmapCache() {
    this._useBitmapCache && this._bitmapCache.reset();
  }

  /**
   * 获取与目标对象之间的夹角
   * @param target
   * @returns {number} 夹角，单位弧度
   */
  public direction(target: DisplayObject): number {
    return Math.atan2(
      this.globalY - target.globalY,
      this.globalX - target.globalX
    );
  }

  public dispose(): void {}
}
