import { Stage, Sprite } from "../lib/index.esm";
export function createDom(el) {
  const stage = new Stage(el);
  const sp = new Sprite();
  sp.graphics.beginFill("red");
  sp.graphics.drawRect(0, 0, 100, 100);
  stage.addChild(sp);
}
