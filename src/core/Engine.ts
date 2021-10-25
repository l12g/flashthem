import EventDispatcher from "../event/Dispatcher";

export default class Engine extends EventDispatcher {
  private _time = 0;
  private _startAt = Date.now();
  private _target: IEngine;
  private _step: () => void;
  private _raf: number = 0;
  constructor(target: IEngine) {
    super();
    this._target = target;
    this._step = () => {
      this._raf = requestAnimationFrame(this._step);
      const current = Date.now();
      const frameDt = 1000 / this._target.fps;
      const elapsed = Math.min(frameDt, current - this._startAt);
      this._startAt = Date.now();
      this._time += elapsed;
      while (this._time >= frameDt) {
        this._target.onEngine(elapsed);
        this._time -= frameDt;
      }
    };
    this.start();
  }
  start() {
    this.stop();
    this._step();
  }
  stop() {
    cancelAnimationFrame(this._raf);
  }
}

export interface IEngine {
  onEngine(elapsed: number): void;
  fps: number;
}
