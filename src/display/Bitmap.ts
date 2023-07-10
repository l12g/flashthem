/**
 * 位图
 * new Bitmap(src)
 * new Bitmap("role.png")
 */
import BitmapData from "../core/BitmapData";
import DisplayObject from "./DisplayObject";

export default class Bitmap extends DisplayObject {
  private _data: BitmapData;
  public get data(): BitmapData {
    return this._data;
  }
  public set data(value: BitmapData) {
    this._data = value;
    if (this.width === 0) {
      this.width = this._data.width;
    }
    if (this.height === 0) {
      this.height = this._data.height;
    }
    this.graphics.clear();
    this.graphics.drawImage(
      this._data.data,
      0,
      0,
      this._data.width,
      this._data.height,
      0,
      0,
      this.width,
      this.height
    );
  }

  constructor(src: string) {
    super();
    const data = new BitmapData(src);
    data.on("load", () => {
      this.data = data;
    });
  }
}
