// import { onInput } from "./utils";

const { Bitmap, Stage } = flashthem;

const stage = new Stage(canvas);
stage.debug(true);

for (let i = 0; i < 5; i++) {
  const bmp = new Bitmap("./assets/hero.png");
  stage.addChildAt(bmp, 0);
  bmp.x = Math.random() * width;
  bmp.y = Math.random() * height;
  bmp.pivotX = bmp.pivotY = 0.5;
  bmp.rotation = Math.random() * 360;
  bmp.on("enter-frame", (e) => {
    e.target.rotation++;
  });
}
