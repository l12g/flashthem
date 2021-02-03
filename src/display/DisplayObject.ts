import Graphics from "../core/Graphics";
import Renderer from "../core/Renderer";
import Vec2 from "../core/Vec2";
import EventDispatcher from "../event/Dispatcher";
import { ADD_TO_STAGE, REMOVE_FROM_STAGE } from "../event/Event";
import { isNum, removeFromArr } from "../utils/index";
import Stage from "./Stage";
export class DisplayObject extends EventDispatcher {
  private _pos: Vec2 = new Vec2();
  private _size: Vec2 = new Vec2();
  private _scale: Vec2 = new Vec2(1, 1);
  public get scale() {
    return this._scale;
  }
  public get scaleX() {
    return this._scale.x;
  }
  public set scaleX(value) {
    this._scale.x = value;
  }
  public get scaleY() {
    return this._scale.y;
  }
  public set scaleY(value) {
    this._scale.y = value;
  }
  private _rotation: number = 0;
  public get rotation(): number {
    return this._rotation;
  }
  public set rotation(value: number) {
    this._rotation = value;
  }
  public get x() {
    return this._pos.x;
  }
  public get y() {
    return this._pos.y;
  }
  public set x(val) {
    this._pos.x = val;
  }
  public set y(val) {
    this._pos.y = val;
  }
  public get width() {
    return this._size.x;
  }
  public get height() {
    return this._size.y;
  }
  public set width(val) {
    this._size.x = val;
  }
  public set height(val) {
    this._size.y = val;
  }
  private _graphics: Graphics;
  public get graphics(): Graphics {
    return this._graphics || (this._graphics = new Graphics(this));
  }
  private _stage: Stage;
  private _children: DisplayObject[] = [];
  public get children() {
    return this._children;
  }
  public get stage() {
    return this._stage;
  }
  public set stage(stage: Stage) {
    if (!stage) {
      this.emit(REMOVE_FROM_STAGE);
    } else {
      this.emit(ADD_TO_STAGE);
    }
    this._stage = stage;
  }
  public draw(render: Renderer, evt?: MouseEvent) {
    this._graphics.draw(render.context, evt);
    for (let i = 0, len = this.children.length; i < len; i++) {
      const child = this.children[i];
      child.draw(render, evt);
    }
  }
  public addChild(child: DisplayObject) {
    this.children.push(child);
  }
  public removeChild(child: DisplayObject) {
    removeFromArr(this.children, child);
  }
}
