import * as Event from "../event/Event";
import { DisplayObject } from "./DisplayObject";
import Sprite from "./Sprite";

export default class Bitmap extends DisplayObject {
  private _src: string;
  protected _imgEl: HTMLImageElement = new Image();
  protected _rawWidth: number;
  protected _rawHeight: number;
  protected _loaded: boolean;
  constructor(src: string) {
    super();
    this.src = src;
  }
  public get src(): string {
    return this._src;
  }
  public set src(value: string) {
    this._src = value;
    this._loaded = false;
    this.load();
  }

  private load() {
    this._imgEl.src = this.src;
    this._imgEl.onload = () => {
      this._rawWidth = this._imgEl.naturalWidth;
      this._rawHeight = this._imgEl.naturalHeight;
      this.width = this.width || this._imgEl.naturalWidth;
      this.height = this.height || this._imgEl.naturalHeight;
      this.draw();
      this._loaded = true;
      this.emit("load");
    };
  }

  protected draw() {
    this.graphics.drawImg(
      this._imgEl,
      0,
      0,
      this._rawWidth,
      this._rawHeight,
      -this.width * this.pivotX,
      -this.height * this.pivotY,
      this.width,
      this.height
    );
  }
}
