import Filter from "./Filter";

export default class BlurFilter extends Filter {
  public blur: number;
  constructor(length: number) {
    super();
    this.blur = length;
  }
  public toString() {
    return `blur(${this.blur}px)`;
  }
}
