const { Sprite, Stage } = flashthem;

const stage = new Stage(canvas);
// 矩形
const rect = new Sprite();
rect.graphics.beginFill("red");
rect.graphics.drawRect(0, 0, 100, 100);
stage.addChild(rect);
rect.x = 200;
rect.y = 100;

// 圆
const circle = new Sprite();
circle.graphics.beginFill("blue");
circle.graphics.drawCircle(0, 0, 20);
stage.addChild(circle);
circle.x = 250;
circle.y = 100;

// 线条
const line = new Sprite();
line.graphics.lineStyle(2, "red");
stage.addChild(line);
line.graphics.moveTo(10, 10);
line.graphics.lineTo(200, 15);
line.graphics.lineTo(100, 50);
line.graphics.lineTo(20, 200);
line.graphics.stroke();
