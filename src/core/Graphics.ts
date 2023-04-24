import DisplayObject from "../display/DisplayObject";
import Renderer from "./Renderer";

interface GraphicsCommand {
  (ctx: CanvasRenderingContext2D): void;
}
export default class Graphics {
  static DEG_TO_RAD = Math.PI / 180;
  private _needStroke = false;
  private _needFill = false;
  private _commands: GraphicsCommand[] = [];
  private _target: DisplayObject;
  public get commands() {
    return this._commands;
  }
  constructor(target: DisplayObject) {
    this._target = target;
  }
  private afterDraw(ctx: CanvasRenderingContext2D) {
    this._needFill && ctx.fill();
    this._needStroke && ctx.stroke();
  }
  public draw(ctx: CanvasRenderingContext2D, evt?: MouseEvent) {
    const target = this._target;
    const mtx = target.matrix;

    ctx.transform(
      mtx.a,
      mtx.b,
      mtx.c,
      mtx.d,
      Math.floor(mtx.tx),
      Math.floor(mtx.ty)
    );
    if (target.useBitmapCache) {
      target.bitmapCache.draw(ctx);
    } else {
      ctx.globalCompositeOperation =
        target.blendMode || ctx.globalCompositeOperation;
      ctx.globalAlpha = target.parent
        ? target.parent.alpha * target.alpha
        : target.alpha;

      target.filters.forEach((f) => {
        ctx.filter = f.toString();
      });
      for (const cmd of this._commands) {
        const result = cmd.call(this, ctx);
        result && this.afterDraw(ctx);
      }
    }

    if (evt && target.mouseEnable) {
      const { offsetX, offsetY } = evt;
      if (
        ctx.isPointInPath(offsetX, offsetY) ||
        ctx.isPointInStroke(offsetX, offsetY)
      ) {
        target.emit(evt.type);
      }
    }

    this._needStroke = false;
    this._needFill = false;
  }

  public clear() {
    this._commands = [];
    this._needStroke = false;
    this._needFill = false;
  }
  // private addCommand(){
  //   this._commands.push(fn);
  // }
  public lineStyle(
    width?: number,
    color?: string | CanvasGradient | CanvasPattern,
    join?: CanvasLineJoin,
    cap?: CanvasLineCap
  ) {
    this._commands.push(function (ctx) {
      this._needStroke = true;
      ctx.lineWidth = width;
      ctx.lineJoin = join;
      ctx.lineCap = cap;
      ctx.strokeStyle = color;
    });
  }
  public beginFill(color: string | CanvasGradient | CanvasPattern) {
    this._commands.push(function (ctx) {
      this._needFill = true;
      ctx.fillStyle = color;
    });
  }
  public drawRect(x: number, y: number, w: number, h: number) {
    this._commands.push(function (ctx) {
      ctx.beginPath();
      ctx.rect(x, y, w, h);
      ctx.closePath();
      return true;
    });
  }
  public drawCircle(cx: number, cy: number, radius: number) {
    this._target.width = this._target.height = radius * 2;
    this._commands.push(function drawCircle(ctx) {
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.closePath();
      return true;
    });
  }
  public drawText(x: number, y: number, text: string, font: string) {
    this._commands = [
      (ctx: CanvasRenderingContext2D) => {
        ctx.font = font;
        ctx.fillText(text, x, y);
        return true;
      },
    ];
  }

  public lineTo(x: number, y: number) {
    this._commands.push(function (ctx) {
      ctx.lineTo(x, y);
      return true;
    });
  }
  public moveTo(x: number, y: number) {
    this._commands.push(function (ctx) {
      ctx.beginPath();
      ctx.moveTo(x, y);
    });
  }
  public quadraticCurveTo(cpx: number, cpy: number, x: number, y: number) {
    this._commands.push(function (ctx) {
      ctx.quadraticCurveTo(cpx, cpy, x, y);
    });
  }
  public stroke() {
    this._commands.push(function (ctx) {
      ctx.stroke();
    });
  }
  public drawImage(
    source,
    sx: number,
    sy: number,
    sw: number,
    sh: number,
    dx: number,
    dy: number,
    dw: number,
    dh: number
  ) {
    this._commands.push(function (ctx) {
      ctx.drawImage(source, sx, sy, sw, sh, dx, dy, dw, dh);
    });
  }
}
