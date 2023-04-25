import { Stage, Sprite } from "../../lib/index.esm";
const stage = new Stage("#demo-sprite");
for (let i = 0; i < 20; i++) {
  const sp = new Sprite();
  sp.graphics.beginFill("red");
  sp.graphics.drawRect(0, 0, Math.random() * 10 + 10, Math.random() * 10 + 10);
  stage.addChild(sp);
  sp.x=Math.random()*550;
  sp.y=Math.random()*400;
}
