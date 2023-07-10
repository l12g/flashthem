const { Bitmap, Stage, TextField, Sprite } = flashthem;

const stage = new Stage(canvas);
stage.debug({ grid: true });
const bmp = new Bitmap("./assets/dragon.png");
bmp.x = 50;
bmp.y = 50;
stage.addChild(bmp);

const bmp2 = new Bitmap("./assets/dragon.png");
bmp2.x = 300;
bmp2.y = 200;
stage.addChild(bmp2);
// bmp2.rotation = 90;
bmp2.pivotX = bmp2.pivotY = 0.5;
// bmp2.scaleX = bmp2.scaleY = .5;
// const t = new TextField("");
// t.width = 200;
// t.size = "30px";
// // stage.addChild(t);
// t.x = t.y = 50;

// const p = new Sprite();
// p.graphics.beginFill("red");
// p.graphics.drawCircle(0, 0, 10);
// p.x = 200;
// p.y = 200;

// stage.addChild(p);

// const rect = new Sprite();
// rect.graphics.beginFill("red");
// rect.graphics.drawRect(0, 0, 100, 100);
// rect.width = 100;
// rect.height = 100;
// // stage.addChild(rect);
// rect.x = 200;
// rect.y = 100;

stage.on("exit-frame", (e) => {
  bmp.x = stage.mouseX;
  bmp.y = stage.mouseY;

  bmp2.rotation++;
  if (bmp.hitTestObject(bmp2)) {
    bmp.alpha = 0.5;
  } else {
    bmp.alpha = 1;
  }
});
