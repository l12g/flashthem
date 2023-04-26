import { Stage, Sprite } from "../lib/index.esm.js";
const stage = new Stage("#demo-sprite");

// 矩形
const rect = new Sprite();
rect.graphics.beginFill("red");
rect.graphics.drawRect(0, 0, 100, 100);
stage.addChild(rect);
rect.x = 100;
rect.y = 100;

// 圆
const circle = new Sprite();
circle.graphics.beginFill("blue");
circle.graphics.drawCircle(0, 0, 20);
stage.addChild(circle);
circle.x = 250;
circle.y = 100;
