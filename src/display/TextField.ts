import Renderer from "../core/Renderer";
import DisplayObject from "./DisplayObject";
import Sprite from "./Sprite";

export default class TextField extends DisplayObject {
  private _text: string;
  private _font: string;
  public get font(): string {
    return this._font;
  }
  public set font(value: string) {
    this._font = value;
    this.graphics.drawText(0, 0, this.text, this.font);
  }
  public get text(): string {
    return this._text;
  }
  public set text(value: string) {
    this._text = value;
    this.graphics.drawText(0, 0, this.text, this.font);
  }
  constructor(text: string, font: string) {
    super();
    this.text = text;
    this.font = font;
  }
}
