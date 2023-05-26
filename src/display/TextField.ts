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

const DEFAULT_FONT = "24px STheiti, SimHei";
export default class TextField extends DisplayObject {
  private _text: string;
  public get text(): string {
    return this._text;
  }
  public set text(value: string) {
    this._text = value;
    this.adjust();
  }
  private _textWidth: number;
  private _textHeight: number;
  public color: string;
  private _size: string;
  public get size(): string {
    return this._size;
  }
  public set size(value: string) {
    this._size = value;
    this.adjust();
  }

  private _fontFamily: string = "STheiti";
  public get fontFamily(): string {
    return this._fontFamily;
  }
  public set fontFamily(value: string) {
    this._fontFamily = value;
    this.adjust();
  }
  private _font: string;
  public get font(): string {
    return this._font;
  }
  public set font(value: string) {
    this._font = value;
    this.adjust();
  }
  public align: TextAlign = "left";
  public baseLine: TextBaseLine = "top";
  public wrap: boolean = true;
  private _adjusted: boolean = false;
  constructor(text: string) {
    super();
    this.text = text;
  }

  private getFont() {
    if (this.font) {
      return this.font;
    }
    return (
      [this.size, this.fontFamily].filter(Boolean).join(" ") || DEFAULT_FONT
    );
  }
  public onRender(renderer: Renderer, evt: MouseEvent, elapsed: number) {
    if (!this._adjusted) {
      this.adjust();
    }
    this.graphics.beginFill(this.color);
    renderer.context.textBaseline = this.baseLine;
    renderer.context.textAlign = this.align;
    renderer.context.font = this.getFont();
    renderer.context.fillText(this.text, 0, 0, this.width);
    // this.graphics.drawText(this.text,0,0,this.getFont())
  }
  private adjust() {
    const { stage } = this;
    if (!stage) {
      return;
    }
    stage.context.save();
    stage.context.font = this.getFont();
    const rect = stage.context.measureText(this.text);
    this._textWidth = rect.width;
    this._textHeight =
      rect.actualBoundingBoxAscent + rect.actualBoundingBoxDescent;
    this.width = this._textWidth;
    this.height = this._textHeight;
    stage.context.restore();
    this._adjusted = true;
  }
}
