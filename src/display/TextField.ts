/**
 * 文本
 * new TextField("hello world",font);
 */
import Renderer from "../core/Renderer";
import DisplayObject from "./DisplayObject";

type TextAlign = "left" | "right" | "center" | "start" | "end";
type TextBaseLine =
  | "top"
  | "hanging"
  | "middle"
  | "alphabetic"
  | "ideographic"
  | "bottom";
export default class TextField extends DisplayObject {
  private _text: string;
  private _textWidth: number;
  private _textHeight: number;
  public get text(): string {
    return this._text;
  }
  public set text(value: string) {
    this._text = value;
  }
  private _font: string = "24px STheiti, SimHei";
  public get font(): string {
    return this._font;
  }
  public set font(value: string) {
    this._font = value;
  }

  private _textAlign: TextAlign;
  public get textAlign(): TextAlign {
    return this._textAlign;
  }
  public set textAlign(value: TextAlign) {
    this._textAlign = value;
  }

  private _textBaseline: TextBaseLine = "top";
  public get textBaseline(): TextBaseLine {
    return this._textBaseline;
  }
  public set textBaseline(value: TextBaseLine) {
    this._textBaseline = value;
  }

  public wrap: boolean = true;
  constructor(text: string) {
    super();
    this.text = text;
  }
  public onRender(renderer: Renderer, evt: MouseEvent, elapsed: number) {
    renderer.context.textBaseline = this.textBaseline;
    renderer.context.textAlign = this.textAlign;
    renderer.context.font = this.font;
    this.adjust(renderer);
    renderer.context.fillText(this.text, 0, 0, this.width);
  }
  private adjust(renderer: Renderer) {
    const rect = renderer.context.measureText(this.text);
    this._textWidth = rect.width;
    this._textHeight =
      rect.actualBoundingBoxAscent + rect.actualBoundingBoxDescent;
    if (this.width === 0) {
      this.width = this._textWidth;
    }
    if (this.height === 0) {
      this.height = this._textHeight;
    }
  }
}
