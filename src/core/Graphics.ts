import { DisplayObject } from "../display/DisplayObject";
import Renderer from "./Renderer";

interface GraphicsRule {
  (ctx: CanvasRenderingContext2D): void;
}
type GraphicLine = [number, number, number, number];
export default class Graphics {
  private _needStroke = false;
  private _needFill = false;
  private _rules: GraphicsRule[] = [];
  private _target: DisplayObject;
  private _lines: GraphicLine[] = [];
  constructor(target: DisplayObject) {
    this._target = target;
    target.on("enter-frame", (e) => {
      (e.data as Renderer).context.save();
    });
    target.on("exit-frame", (e) => {
      (e.data as Renderer).context.restore();
    });
  }
  public draw(render: Renderer, evt?: MouseEvent) {
    const ctx = render.context;
    const target = this._target;
    ctx.translate(target.x, target.y);
    ctx.rotate(target.rotation);
    ctx.scale(target.scaleX, target.scaleY);
    if (target.blendMode) ctx.globalCompositeOperation = target.blendMode;
    ctx.globalAlpha = target.parent
      ? target.parent.alpha * target.alpha
      : target.alpha;
    if (this._lines.length) {
      this._lines.forEach((v) => {
        ctx.moveTo(v[0], v[1]);
        ctx.lineTo(v[2], v[3]);
      });
      ctx.stroke();
    }
    for (const rule of this._rules) {
      const result = rule.call(this, ctx);
      result && this.afterDraw(ctx);
    }

    this._needStroke = false;
    this._needFill = false;
  }
  public afterDraw(ctx: CanvasRenderingContext2D) {
    this._needFill && ctx.fill();
    this._needStroke && ctx.stroke();
  }
  public clear() {
    this._rules = [];
    this._lines = [];
    this._needStroke = false;
    this._needFill = false;
  }
  public lineStyle(
    width?: number,
    color?: string | CanvasGradient | CanvasPattern,
    join?: CanvasLineJoin,
    cap?: CanvasLineCap
  ) {
    this._rules.push((ctx) => {
      this._needStroke = true;
      ctx.lineWidth = width;
      ctx.lineJoin = join;
      ctx.lineCap = cap;
      ctx.strokeStyle = color;
    });
  }
  public beginFill(color: string | CanvasGradient | CanvasPattern) {
    this._rules.push((ctx) => {
      this._needFill = true;
      ctx.fillStyle = color;
    });
  }
  public drawRect(x: number, y: number, w: number, h: number) {
    this._rules.push((ctx) => {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.closePath();
      return true;
    });
  }
  public drawImg(
    img: CanvasImageSource,
    dx,
    dy,
    dw,
    dh,
    sx?: number,
    sy?: number,
    sw?: number,
    sh?: number
  ) {
    const ags = arguments;
    this._rules = [
      function drawImg(ctx) {
        ctx.drawImage.apply(ctx, ags);
      },
    ];
  }
  public drawCircle(cx: number, cy: number, radius: number) {
    this._rules.push(function drawCircle(ctx) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.closePath();
      return true;
    });
  }
  public drawText(x: number, y: number, text: string, font: string) {
    this._rules = [
      (ctx: CanvasRenderingContext2D) => {
        ctx.font = font;
        ctx.fillText(text, x, y);
        return true;
      },
    ];
  }
  public drawLine(x0: number, y0: number, x1: number, y1: number) {
    this._lines.push([x0, y0, x1, y1]);
  }
  public lineTo(x: number, y: number) {
    this._rules.push((ctx) => {
      ctx.lineTo(x, y);
    });
  }
  public stroke() {
    this._rules.push((ctx) => {
      ctx.stroke();
    });
  }
}
