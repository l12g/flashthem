/**
 * 文本
 * new TextField("hello world",font);
 */
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
    this.updateDraw();
  }
  private _textWidth: number;
  private _textHeight: number;
  private _color: string;
  public get color(): string {
    return this._color;
  }
  public set color(value: string) {
    this._color = value;
    this.updateDraw();
  }
  private _size: string = "24px";
  public get size(): string {
    return this._size;
  }
  public set size(value: string) {
    this._size = value;
    this.updateDraw();
  }

  private _fontFamily: string = "STheiti";
  public get fontFamily(): string {
    return this._fontFamily;
  }
  public set fontFamily(value: string) {
    this._fontFamily = value;
    this.updateDraw();
  }
  private _font: string;
  public get font(): string {
    return this._font;
  }
  public set font(value: string) {
    this._font = value;
    this.updateDraw();
  }
  public align: TextAlign = "left";
  public baseLine: TextBaseLine = "middle";
  public wrap: boolean = true;
  constructor(text: string) {
    super();
    this.text = text;
    this.on("add-to-stage", () => {
      this.adjust();
    });
  }

  private getFont() {
    if (this.font) {
      return this.font;
    }
    return (
      [this.size, this.fontFamily].filter(Boolean).join(" ") || DEFAULT_FONT
    );
  }

  public onRender() {
    this.graphics.context.textBaseline = this.baseLine;
    this.graphics.context.textAlign = this.align;
  }

  private updateDraw() {
    this.graphics.clear();
    this.graphics.beginFill(this.color);

    this.graphics.drawText(this.text, 0, 0, this.getFont());
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
  }
}
