import Renderer from "../core/Renderer";
import DisplayObject from "./DisplayObject";

export default abstract class DisplayObjectContainer extends DisplayObject {
  public readonly children: DisplayObject[] = [];
  public onRender(render: Renderer, evt: MouseEvent, elapsed: number) {
    for (let i = 0, len = this.children.length; i < len; i++) {
      this.children[i].render(render, evt, elapsed);
    }
  }
  public addChild(child: DisplayObject) {
    this.addChildAt(child, this.children.length);
  }
  public addChildAt(child: DisplayObject, idx: number = 0) {
    child.remove();
    this.children.splice(idx, 0, child);
    child.parent = this;
    child.emit("add-to-stage");
  }
  public removeChild(child: DisplayObject) {
    this.removeChildAt(this.children.indexOf(child));
  }
  public removeChildAt(idx: number) {
    if (idx < 0 || idx > this.children.length - 1) {
      return;
    }
    const child = this.children[idx];
    child.parent = null;
    this.children.splice(idx, 1);
    child.emit("removed");
  }
  public swapChild(child1: DisplayObject, child2: DisplayObject) {
    const idx1 = this.children.indexOf(child1);
    const idx2 = this.children.indexOf(child2);
    if (idx1 >= 0 && idx2 >= 0) {
      this.children[idx2] = child1;
      this.children[idx1] = child2;
    }
  }
  public override dispose() {
    this.children.forEach((ch) => ch.dispose());
  }
}
