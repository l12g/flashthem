import DisplayObject from "./DisplayObject";

export default class Grid extends DisplayObject {
  public cellWidth: number = 50;
  public cellHeight: number = 50;
  constructor() {
    super();
    this.on("enter-frame", () => {
      this.graphics.clear();
      this.graphics.lineStyle(1, "#ddd");
      for (let i = 0; i < this.width; i += this.cellWidth) {
        this.graphics.moveTo(i, 0);
        this.graphics.lineTo(i, this.height);
      }
      for (let j = 0; j < this.height; j += this.cellHeight) {
        this.graphics.moveTo(0, j);
        this.graphics.lineTo(this.width, j);
      }
    });
  }
}
