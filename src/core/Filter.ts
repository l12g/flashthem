class PercentFilter {
  private _percentage: number;
  private _name: string;
  private _max: number;
  private _min: number;
  public get percentage(): number {
    return this._percentage;
  }
  public set percentage(value: number) {
    this._percentage = Math.max(this._min, Math.min(this._max, value));
  }
  public toString() {
    return `${this._name}(${this.percentage}%)`;
  }
  constructor(
    name: string,
    value: number = 0,
    min: number = 0,
    max: number = 100
  ) {
    this._name = name;
    this._max = max;
    this._min = min;
    this.percentage = value;
  }
}
export class BrightnessFilter extends PercentFilter {
  constructor(value: number) {
    super("brightness", value);
  }
}
export class ContrastFilter extends PercentFilter {
  constructor(value: number) {
    super("contrast", value);
  }
}
export class GrayFilter extends PercentFilter {
  constructor(value: number) {
    super("grayscale", value);
  }
}

export class InvertFilter extends PercentFilter {
  constructor(value: number) {
    super("invert", value);
  }
}
export class SaturateFilter extends PercentFilter {
  constructor(value: number) {
    super("saturate", value);
  }
}
export class SepiaFilter extends PercentFilter {
  constructor(value: number) {
    super("sepia", value);
  }
}

export class BlurFilter {
  public blur: number;
  constructor(length: number) {
    this.blur = length;
  }
  public toString() {
    return `blur(${this.blur}px)`;
  }
}
