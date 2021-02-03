import { DisplayObject } from "../display/DisplayObject";

interface GraphicsRule {
  (ctx: OffscreenCanvasRenderingContext2D): void;
}

export default class Graphics {
  private _needStroke = false;
  private _rules: GraphicsRule[] = [];
  private _target: DisplayObject;
  constructor(target: DisplayObject) {
    this._target = target;
  }
  public draw(ctx: OffscreenCanvasRenderingContext2D, evt: MouseEvent) {
    ctx.save();
    ctx.translate(this._target.x, this._target.y);
    ctx.rotate(this._target.rotation);
    ctx.scale(this._target.scaleX, this._target.scaleY);
    for (const rule of this._rules) {
      rule(ctx);
    }
    if (evt && ctx.isPointInPath(evt.clientX, evt.clientY)) {
      this._target.emit("click", evt);
    }
    ctx.restore();
  }
  public clear() {
    this._rules = [];
    this._needStroke = false;
  }
  public lineStyle(
    width?: number,
    color?: string | CanvasGradient | CanvasPattern,
    join?: CanvasLineJoin,
    cap?: CanvasLineCap
  ) {
    this._needStroke = true;
    this._rules.push((ctx) => {
      ctx.lineWidth = width;
      ctx.lineJoin = join;
      ctx.lineCap = cap;
      ctx.strokeStyle = color;
    });
  }
  public beginFill(color: string | CanvasGradient | CanvasPattern) {
    this._rules.push((ctx) => {
      ctx.fillStyle = color;
    });
  }
  public drawRect(x: number, y: number, w: number, h: number) {
    this._rules.push((ctx) => {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.fill();
      this._needStroke && ctx.stroke();
      ctx.closePath();
    });
  }
  public drawCircle(cx: number, cy: number, radius: number) {
    this._rules.push((ctx) => {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fill();
      this._needStroke && ctx.stroke();
      ctx.closePath();
    });
  }
}
