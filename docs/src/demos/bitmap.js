// import { onInput } from "./utils";

const { Bitmap, Stage } = flashthem;

const stage = new Stage(canvas);

const bmp = new Bitmap("./assets/hero.png");
stage.addChild(bmp);
bmp.x = bmp.y = 100;
bmp.pivotX = bmp.pivotY = 0.5;



//hides
// onInput("#bmp-sx", (value) => {
//   bmp.scaleX = value;
// });
// onInput("#bmp-sy", (value) => {
//   bmp.scaleY = value;
// });
// onInput("#bmp-alpha", (value) => {
//   bmp.alpha = value;
// });
// stage.debug = true;
//hidee
