import Graphics from "../core/Graphics";
import Renderer from "../core/Renderer";
import EventDispatcher from "../event/Dispatcher";
import DisplayObjectContainer from "./DisplayObjectContainer";

type BlendMode =
  | "source-over"
  | "source-in"
  | "source-out"
  | "source-atop"
  | "destination-over"
  | "destination-in"
  | "destination-out"
  | "destination-atop"
  | "lighter"
  | "copy"
  | "xor"
  | "multiply"
  | "screen"
  | "overlay"
  | "darken"
  | "lighten"
  | "color-dodge"
  | "color-burn"
  | "hard-light"
  | "soft-light"
  | "difference"
  | "exclusion"
  | "hue"
  | "saturation"
  | "color"
  | "luminosity";

export abstract class DisplayObject extends EventDispatcher {
  public mouseEnable: boolean = false;
  public blendMode: BlendMode;
  public x: number = 0;
  public y: number = 0;

  public width: number = 0;
  public height: number = 0;

  public pivotX: number = 0.5;
  public pivotY: number = 0.5;

  public scaleX: number = 1;
  public scaleY: number = 1;

  public rotation: number = 0;

  public _alpha: number = 1;

  private _parent: DisplayObjectContainer;
  public get parent() {
    return this._parent;
  }
  public set parent(v: DisplayObjectContainer) {
    this._parent = v;
  }

  public get alpha(): number {
    if (this._parent) {
      return this.parent.alpha * this._alpha;
    }
    return this._alpha;
  }
  public set alpha(value: number) {
    this._alpha = value;
  }

  private _graphics: Graphics;
  public get graphics(): Graphics {
    return this._graphics || (this._graphics = new Graphics(this));
  }

  public render(render: Renderer, evt?: MouseEvent) {
    this.emit("enter-frame", render);
    this.graphics.draw(render, evt);
    this.onRender(render, evt);
    this.emit("exit-frame", render);
  }
  protected onRender(render: Renderer, evt?: MouseEvent) {
  }

  public remove() {
    if (this.parent) {
      this.parent.removeChild(this);
    }
  }

}
