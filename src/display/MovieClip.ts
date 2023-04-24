/**
 * 动画
 *
 * new MovieClip(src,clips)
 *
 *
 * new MovieClip(“hero.png”，[
 *  {x:0,y:0,w:50,h:50},
 *  {x:50,y:0,w:50,h:50},
 *  {x:100,y:0,w:50,h:50},
 * ])
 */
import Engine, { IEngine } from "../core/Engine";
import Renderer from "../core/Renderer";
import { removeFromArr } from "../utils/index";
import Bitmap from "./Bitmap";
type ClipItem = {
  w: number;
  h: number;
  x: number;
  y: number;
};

export default class MovieClip extends Bitmap implements IEngine {
  public fps: number = 12;
  public loop: boolean = true;
  private _currentFrame: number = 0;
  private _engine: Engine;
  private _clips: ClipItem[] = [];
  public autoSize: boolean = true;
  public play() {
    this._engine.start();
  }
  public pause() {
    this._engine.stop();
  }
  public stop() {
    this._currentFrame = 0;
    this.pause();
  }
  public gotoAndStop(frame: number) {
    this._currentFrame = frame;
    this.pause();
  }
  public gotoAndPlay(frame: number) {
    this._currentFrame = frame;
    this.play();
  }
  constructor(src: string, clips: ClipItem[]) {
    super(src);
    this.src = src;
    this._engine = new Engine(this);
    this._clips = clips;
  }
  public onEngine(elapsed: number) {
    if (!this._loaded) {
      return;
    }
    this._currentFrame++;
    if (this._currentFrame > this._clips.length - 1) {
      if (this.loop) {
        this._currentFrame = 0;
      } else {
        this._currentFrame = this._clips.length - 1;
        this.pause();
        this.emit("complete");
      }
    }
  }

  public onRender(renderer: Renderer, evt?: MouseEvent) {
    const clip = this._clips[this._currentFrame];
    if (!clip) return;

    if (this.autoSize) {
      this.width = clip.w;
      this.height = clip.h;
    }

    renderer.context.drawImage(
      this._imgEl,
      clip.x,
      clip.y,
      clip.w,
      clip.h,
      -this.width * this.pivotX,
      -this.height * this.pivotY,
      this.width,
      this.height
    );
  }

  public addClip(clip: ClipItem) {
    this._clips.push(clip);
  }
  public addClipAt(clip: ClipItem, idx: number) {
    this._clips.splice(idx, 0, clip);
  }
  public removeClip(idx: number) {
    removeFromArr(this._clips, this._clips[idx]);
  }
  public setClips(clips: ClipItem[]) {
    this._clips = clips;
  }
}
