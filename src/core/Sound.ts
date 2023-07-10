import EventDispatcher from "../event/Dispatcher";

function loadSound(src: string, ctx: AudioContext): Promise<AudioBuffer> {
  return fetch(src)
    .then((d) => d.arrayBuffer())
    .then((data) => {
      return ctx.decodeAudioData(data);
    });
}
export default class Sound extends EventDispatcher {
  private _src: string;
  public get src(): string {
    return this._src;
  }
  public set src(value: string) {
    this._src = value;
    loadSound(this._src, this._ctx).then((buffer) => {
      this._buffer = buffer;
      console.log(buffer);

      this.emit("load");
    });
  }
  private _ctx: AudioContext;
  private _source: AudioBufferSourceNode;
  private _mute: boolean = false;
  private _buffer: AudioBuffer;
  private _gain: GainNode;
  private _paused: boolean;
  private _volum: number = 0.3;
  public get volum(): number {
    return this._volum;
  }
  public set volum(value: number) {
    this._volum = value;
    this._gain.gain.value = value;
  }
  public get mute(): boolean {
    return this._mute;
  }
  public set mute(value: boolean) {
    this._mute = value;
    this._gain.gain.value = value ? 0 : this.volum;
  }
  public get currentTime(): number {
    return this._ctx.currentTime || 0;
  }
  public get duration(): number {
    if (!this._buffer) {
      return 0;
    }
    return this._buffer.duration;
  }
  constructor(src: string) {
    super();
    this._ctx = new AudioContext();
    this._gain = this._ctx.createGain();
    this._gain.gain.value = this.volum;
    this.src = src;
    this._ctx.addEventListener("statechange", (e) => {
      console.log(e);
    });
  }
  play() {
    if (this._paused) {
      this._paused = false;
      this._ctx.resume();
    } else {
      if (this._ctx.state === "suspended") {
        this._ctx.resume();
      }
      if (!this._source) {
        this._source = this._ctx.createBufferSource();
        this._source.buffer = this._buffer;
        this._source.connect(this._gain);
        this._gain.connect(this._ctx.destination);
        this._source.start(0, 0);
      }
    }
  }
  pause() {
    this._ctx.suspend();
    this._paused = true;
  }
  stop() {
    if (this._source) {
      this._source.stop();
      this._source = null;
    }
  }
  seek(time: number) {
    if (this._source) {
      this._source.start(0, time);
    }
  }
}
