/**
 * 位图
 * new Bitmap(src)
 * new Bitmap("role.png")
 */
import DisplayObject from "./DisplayObject";

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
      this.width = this._rawWidth;
      this.height = this._rawHeight;
      this._loaded = true;
      setTimeout(() => {
        this.emit("load");
      }, 0);
      this.graphics.drawImage(
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
    };
  }
}
