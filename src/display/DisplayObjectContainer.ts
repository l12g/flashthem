import Renderer from "../core/Renderer";
import { removeFromArr } from "../utils/index";
import { DisplayObject } from "./DisplayObject";

export default abstract class DisplayObjectContainer extends DisplayObject {
  public readonly children: DisplayObject[] = [];
  public onRender(render: Renderer, evt?: MouseEvent) {
    for (let i = 0, len = this.children.length; i < len; i++) {
      const child = this.children[i];
      child.render(render, evt);
    }
  }

  public addChild(child: DisplayObject) {
    this.addChildAt(child, this.children.length);
  }
  public addChildAt(child: DisplayObject, idx: number = 0) {
    child.remove();
    this.children.splice(idx, 0, child);
    child.parent = this;
    child.emit("added");
    this.calcSize();
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
    this.calcSize();
  }

  public swapChild(child1: DisplayObject, child2: DisplayObject) {
    const idx1 = this.children.indexOf(child1);
    const idx2 = this.children.indexOf(child2);
    if (idx1 >= 0 && idx2 >= 0) {
      this.children[idx2] = child1;
      this.children[idx1] = child2;
    }
    this.calcSize();
  }
  public calcSize() {
    let w = 0;
    for (let i = 0; i < this.children.length; i++) {
      w = Math.max(w, this.children[i].width);
    }
    this.width = w;
  }
}
