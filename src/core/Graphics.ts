import DisplayObject from "../display/DisplayObject";

interface GraphicsCommand {
  (ctx: CanvasRenderingContext2D): void;
}
export default class Graphics {
  static DEG_TO_RAD = Math.PI / 180;
  private _needStroke = false;
  private _needFill = false;
  private _commands: GraphicsCommand[] = [];
  private _target: DisplayObject;
  private _hovered: boolean;
  public context: CanvasRenderingContext2D;
  private _leaved: boolean;
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
  public draw(
    ctx: CanvasRenderingContext2D,
    evt?: MouseEvent,
    onDraw?: () => void
  ) {
    this.context = ctx;
    const target = this._target;

    if (target.shadow) {
      ctx.shadowBlur = target.shadow.blur;
      ctx.shadowColor = target.shadow.color;
      ctx.shadowOffsetX = target.shadow.offsetX;
      ctx.shadowOffsetY = target.shadow.offsetY;
    }
    // ctx.transform(
    //   mtx.a,
    //   mtx.b,
    //   mtx.c,
    //   mtx.d,
    //   Math.floor(mtx.tx),
    //   Math.floor(mtx.ty)
    // );
    ctx.translate(target.x, target.y);
    ctx.scale(target.scaleX, target.scaleY);
    ctx.rotate((target.rotation * Math.PI) / 180);
    if (target.useBitmapCache) {
      target.bitmapCache.draw(ctx);
    } else {
      ctx.globalCompositeOperation =
        target.blendMode || ctx.globalCompositeOperation;
      ctx.globalAlpha = target.parent
        ? target.parent.alpha * target.alpha
        : target.alpha;

      ctx.filter = target.filters.map((o) => o.toString()).join(" ");
      onDraw && onDraw();

      for (const cmd of this._commands) {
        const result = cmd.call(this, ctx);
        result && this.afterDraw(ctx);
      }
    }
    this.checkEvent(ctx, evt);
    this._needStroke = false;
    this._needFill = false;
  }

  private checkEvent(ctx: CanvasRenderingContext2D, evt: MouseEvent) {
    const target = this._target;
    if (evt && target.mouseEnable) {
      const dpr = target.stage.dpr;
      const { offsetX, offsetY } = evt;
      const ox = offsetX * dpr;
      const oy = offsetY * dpr;
      const data = {
        x: ox,
        y: oy,
      };
      const { type } = evt;
      if (ctx.isPointInPath(ox, oy) || ctx.isPointInStroke(ox, oy)) {
        if (type === "mousemove") {
          if (!this._hovered) {
            this._hovered = true;
            target.emit("mouseover", data);
          }
        } else {
          target.emit(evt.type, data);
        }
      } else {
        if (this._hovered) {
          this._hovered = false;
          target.emit("mouseout", data);
        }
      }
    }
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

  public fontStyle(
    font: string,
    align?: CanvasTextAlign,
    baseLine?: CanvasTextBaseline
  ) {
    this._commands.push(function (ctx) {
      ctx.textAlign = align;
      ctx.textBaseline = baseLine;
      ctx.font = font;
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
      const { pivotX, pivotY, width, height } = this._target;
      ctx.beginPath();
      ctx.rect(x - pivotX * width, y - pivotY * height, w, h);
      ctx.closePath();
      return true;
    });
  }
  public drawCircle(cx: number, cy: number, radius: number) {
    this._target.width = this._target.height = radius * 2;
    this._commands.push(function drawCircle(ctx) {
      const { pivotX, pivotY, width, height } = this._target;

      ctx.beginPath();
      ctx.arc(
        cx - pivotX * width,
        cy - pivotY * height,
        radius,
        0,
        Math.PI * 2
      );
      ctx.closePath();
      return true;
    });
  }
  public drawText(text: string, x: number, y: number, font: string) {
    this._commands.push((ctx: CanvasRenderingContext2D) => {
      ctx.font = font;
      const { pivotX, pivotY, width, height } = this._target;
      ctx.fillText(text, x - pivotX * width, y - pivotY * height, width);
    });
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
      const { pivotX, pivotY, width, height } = this._target;
      ctx.drawImage(
        source,
        sx,
        sy,
        sw,
        sh,
        dx - pivotX * width,
        dy - pivotY * height,
        dw,
        dh
      );
    });
  }
}
