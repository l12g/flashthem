import EventDispatcher from "../event/Dispatcher";
import { loadImg } from "../utils";

export default class BitmapData extends EventDispatcher {
  public get width(): number {
    return this._data.width;
  }
  public get height(): number {
    return this._data.height;
  }
  private _data: ImageBitmap;
  public get data(): ImageBitmap {
    return this._data;
  }
  private _src: string;
  public get src(): string {
    return this._src;
  }
  public set src(value: string) {
    this._src = value;
    this.load();
  }
  constructor(src: string) {
    super();
    this.src = src;
  }
  private load() {
    loadImg(this.src)
      .then((e) => e.el)
      .then(createImageBitmap)
      .then(
        (data) => {
          this._data = data;
          console.log(data);

          this.emit("load");
        },
        (err) => {
          console.log(err);
        }
      );
  }

  public dispose(): void {
    super.dispose();
    this._data.close();
  }
}
