export default class Shadow {
  color: string;
  blur: number = 5;
  offsetX: number = 5;
  offsetY: number = 5;
  constructor(color?: string) {
    this.color = color;
  }
}
